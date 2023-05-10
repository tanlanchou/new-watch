import { Injectable } from '@nestjs/common';
import { IExec } from '../interface/IExec';
import { SocialService } from './social.service';
import { parseStringPromise } from 'xml2js';
import { HistoryService } from './history.service'; // 引入 history.service.ts
import { NotifyService } from './notify.service';
import { stripHtmlTags } from 'src/common/string.helper';
import { socialType } from '../enums';
import { UserInfoService } from '../service/user.service';
import { UserMonitorService } from '../service/user.monitor.service';
import { History } from '../db/entitys/history.entity';

@Injectable()
export class ExecWeiboService implements IExec {
  constructor(
    private readonly socialService: SocialService,
    private readonly notifyService: NotifyService,
    private readonly historyService: HistoryService,
    private readonly userInfoService: UserInfoService,
    private readonly userMonitorService: UserMonitorService,
  ) {}

  async execute(userId: string): Promise<void> {
    const userInfo = await this.socialService.getWeiboUserInfo(userId);
    const parsedUserInfo = await parseStringPromise(userInfo);
    const items = parsedUserInfo.rss.channel[0].item;
    const title = parsedUserInfo.rss.channel[0].title;

    const historys = await this.historyService.findByTaskTypeAndUserId(
      socialType.weibo,
      userId,
    ); // 使用 historyService 查询历史记录

    //第一次不通知
    if (historys.length === 0) {
      for (const newhistory of this.itemToHistory(userId, items)) {
        await this.historyService.create(newhistory);
      }
    } else {
      const newHistroys = this.itemToHistory(userId, items);
      let count = 0;
      for (const newHistory of newHistroys) {
        const result =
          !!historys[count] && historys[count].content === newHistory.content;

        //判断是否需要通知
        if (!result) {
          //获取通知信息
          const userMonitors =
            await this.userMonitorService.findAllLocalUserIdByUserId(
              newHistory.user_id,
            );

          if (userMonitors === null || userMonitors.length === 0) {
            return;
          }

          //遍历
          for (const userMonitor of userMonitors) {
            const userInfo = await this.userInfoService.findOneById(
              userMonitor.local_user_id,
            );

            //通知
            const subject = `您好，您订阅的 ${title}的微博发生了改变`;
            let msg = `
              <p>${title} 的第${count}微博发生了变化</p>
            `;

            msg += `<p>标题:</p><section>${items[count].title}</section>`;
            msg += `<p>描述:</p><section>${items[count].description}</section>`;
            msg += `<p>链接:</p><section>${items[count].link}</section>`;
            msg += `<p>时间:</p><section>${items[count].pubDate}</section>`;

            this.notifyService.notify(userInfo.id, subject, msg);
          }

          //处理history
          this.historyService.removeAll(newHistory.user_id);

          //更新history
          this.historyService.createBulk(newHistroys);

          //跳出
          break;
        }

        count++;
      }
    }
  }

  private itemToHistory(userId, items) {
    const arr: Partial<History>[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemTitle = stripHtmlTags(item.title[0]); // 获取 item title
      const itemDescription = stripHtmlTags(item.description[0]); // 获取 item description
      const itemPubDate = stripHtmlTags(item.pubDate[0]); // 获取 item pubDate
      const itemLink = stripHtmlTags(item.link[0]); // 获取 item link

      const content = (
        itemTitle +
        itemDescription +
        itemPubDate +
        itemLink
      ).replace(/ /g, '');

      const history = {
        index: i + 1,
        user_id: userId,
        task_type: socialType.weibo,
        content: Buffer.from(content).toString('base64'),
        update_time: new Date(),
      };
      arr.push(history);
    }
    return arr;
  }
}
