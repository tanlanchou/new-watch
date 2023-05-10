import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ConfigService } from '@nestjs/config';
import { UserInfoService } from '../service/user.service';

@Injectable()
export class NotifyService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private readonly logger = new Logger(NotifyService.name);

  constructor(
    private configService: ConfigService,
    private userInfoService: UserInfoService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get('MAIL_SERVICE'),
      secure: this.configService.get('MAIL_SECURE'), // true for 465, false for other ports
      auth: {
        user: this.configService.get('MAIL_USER'), // generated ethereal user
        pass: this.configService.get('MAIL_PASS'), // generated ethereal password
      },
    });
  }

  async notify(localUserId: number, subject: string, msg: string) {
    this.logger.log(`发送新的通知: userId:${localUserId}, msg:${msg}`);

    // create reusable transporter object using the default SMTP transport
    const userInfo = await this.userInfoService.findOneById(localUserId);
    if (userInfo === null || !userInfo.email) {
      this.logger.error(
        `找不到用户 userId:${localUserId}, userInfo:${userInfo}`,
      );
      return;
    }

    // send mail with defined transport object
    const info = await this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM'), // sender address
      to: userInfo.email, // list of receivers
      subject: subject, // Subject line
      html: msg, // html body
    });

    this.logger.log(`发送通知状态: ${info.messageId}`);
  }
}
