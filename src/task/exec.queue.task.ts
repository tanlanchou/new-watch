import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TaskQueueService } from '../service/task.queue.service';
import { ExecFacotryService } from 'src/service/exec.factory.service';
import { UserMonitorService } from '../service/user.monitor.service';

@Injectable()
export class ExecQueueTask {
  constructor(
    private readonly taskQueueService: TaskQueueService,
    private readonly execFacotryService: ExecFacotryService,
    private readonly userMonitorService: UserMonitorService,
  ) {}

  @Cron('0 * * * * *')
  async handleCron() {
    const queues = await this.taskQueueService.findUnExecByCount();
    for (const queue of queues) {
      const service = this.execFacotryService.getExecService(queue.task_type);
      await service.execute(queue.user_id);

      //删除队列
      await this.taskQueueService.delete(queue.id);

      //更新时间
      await this.userMonitorService.updateTime(queue.user_id);
    }
  }
}
