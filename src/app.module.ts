import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './db/entitys/history.entity';
import { TaskQueue } from './db/entitys/task.queue.entity';
import { UserInfo } from './db/entitys/user.info.entity';
import { UserMonitor } from './db/entitys/user.monitor.entity';
import { TypeOrmConfigService } from './config/typeorm.config';
import { AddQueueTask } from './task/add.queue.task';
import { ExecQueueTask } from './task/exec.queue.task';
import { UserMonitorService } from './service/user.monitor.service';
import { TaskQueueService } from './service/task.queue.service';
import { ExecFacotryService } from './service/exec.factory.service';
import { ExecWeiboService } from './service/exec.weibo.service';
import { SocialService } from './service/social.service';
import { HistoryService } from './service/history.service';
import { NotifyService } from './service/notify.service';
import { UserInfoService } from './service/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([History, TaskQueue, UserInfo, UserMonitor]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AddQueueTask,
    ExecQueueTask,
    UserMonitorService,
    TaskQueueService,
    ExecFacotryService,
    ExecWeiboService,
    SocialService,
    HistoryService,
    NotifyService,
    UserInfoService,
  ],
})
export class AppModule {}
