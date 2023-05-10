import { Test, TestingModule } from '@nestjs/testing';
import { NotifyService } from './notify.service';
import { ConfigService } from '@nestjs/config';
import { UserInfoService } from '../service/user.service';

describe('NotifyService', () => {
  let notifyService: NotifyService;
  let configService: ConfigService;
  let userInfoService: UserInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotifyService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'MAIL_SERVICE') return 'mail-service';
              if (key === 'MAIL_SECURE') return true;
              if (key === 'MAIL_USER') return 'mail-user';
              if (key === 'MAIL_PASS') return 'mail-pass';
              if (key === 'MAIL_FROM') return 'mail-from';
            }),
          },
        },
        {
          provide: UserInfoService,
          useValue: {
            findOneById: jest.fn(() => {
              return { email: 'test@example.com' };
            }),
          },
        },
      ],
    }).compile();

    notifyService = module.get<NotifyService>(NotifyService);
    configService = module.get<ConfigService>(ConfigService);
    userInfoService = module.get<UserInfoService>(UserInfoService);
  });

  describe('notify', () => {
    it('should send mail with correct options', async () => {
      const sendMailSpy = jest.spyOn(notifyService['transporter'], 'sendMail');

      await notifyService.notify(4, 'test-subject', 'test-message');

      expect(sendMailSpy).toHaveBeenCalledWith({
        from: 'mail-from',
        to: 'test@example.com',
        subject: 'test-subject',
        html: 'test-message',
      });
    });

    it('should log error when user not found', async () => {
      jest.spyOn(userInfoService, 'findOneById').mockResolvedValueOnce(null);
      const loggerSpy = jest.spyOn(notifyService['logger'], 'error');

      await notifyService.notify(4, 'test-subject', 'test-message');

      expect(loggerSpy).toHaveBeenCalledWith('找不到用户 userId:2');
    });
  });
});
