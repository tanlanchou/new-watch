import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface weiboOptions {
  displayComments: boolean;
}

@Injectable()
export class SocialService {
  private baseUrl: string;
  private readonly logger = new Logger(SocialService.name);

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get('SOCIAL_MEDIA_API');
  }

  async getWeiboUserInfo(
    id: string,
    options: weiboOptions = { displayComments: true },
  ): Promise<string> {
    this.logger.log(`开始获取用户 ${id} 最新微博`);
    const curUrl = `${this.baseUrl}/weibo/user/${id}?displayComments=${options.displayComments}`;
    this.logger.log(`用户链接: ${curUrl}`);
    const o = this.httpService.get<string>(curUrl);
    const result = await firstValueFrom(o);
    return result.data;
  }
}
