import { Test, TestingModule } from '@nestjs/testing';
import { SocialService } from './social.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

describe('SocialService', () => {
  let socialService: SocialService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [SocialService],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        HttpModule.register({
          timeout: 15000,
          maxRedirects: 5,
        }),
      ],
    }).compile();

    socialService = moduleRef.get<SocialService>(SocialService);
  });

  describe('获取微博用户 caicaiwei', () => {
    it('返回最 caicaiwei 最新的10条微博', async () => {
      const result = await socialService.getWeiboUserInfo(`1703386861`);
      expect(typeof result === 'string').toBe(true);
    });
  });
});
