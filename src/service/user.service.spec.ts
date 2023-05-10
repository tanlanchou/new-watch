import { Test, TestingModule } from '@nestjs/testing';
import { UserInfoService } from './user.service';
import { TypeOrmConfigService } from '../config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { History } from '../db/entitys/history.entity';
import { TaskQueue } from '../db/entitys/task.queue.entity';
import { UserInfo } from '../db/entitys/user.info.entity';
import { UserMonitor } from '../db/entitys/user.monitor.entity';
import * as crypto from 'crypto';
import { userStatus } from '../enums';

const email = `${new Date().getTime().toString()}@qq.com`;
const password = new Date().getTime().toString();

describe('UserService', () => {
  let userInfoService: UserInfoService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [UserInfoService],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService,
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([History, TaskQueue, UserInfo, UserMonitor]),
      ],
    }).compile();

    userInfoService = moduleRef.get<UserInfoService>(UserInfoService);
  });

  describe('增删查改用户', () => {
    it(`查询用户 ${email}`, async () => {
      const result = await userInfoService.findOneByEmail(email);
      expect(result === null).toBe(true);
    });

    it(`创建用户 ${email}`, async () => {
      const hash = crypto.createHash('md5');
      hash.update(password);
      const pwd = hash.digest('hex');
      const result = await userInfoService.create({
        email,
        password: pwd,
      });
      expect(result.email === email && result.password === pwd).toBe(true);
    });

    it(`查询用户创建结果 ${email}`, async () => {
      const result = await userInfoService.findOneByEmail(email);
      expect(result.email === email).toBe(true);
    });

    it(`更新 ${email} 状态`, async () => {
      const user = await userInfoService.findOneByEmail(email);
      user.status = userStatus.disable;
      const result = await userInfoService.update(user.id, user);
      expect(result.status === userStatus.disable).toBe(true);
    });

    it(`查询用户更新结果 ${email}`, async () => {
      const result = await userInfoService.findOneByEmail(email);
      expect(result.status === userStatus.disable).toBe(true);
    });

    it(`删除 ${email}`, async () => {
      const result = await userInfoService.findOneByEmail(email);
      await userInfoService.remove(result.id);

      const user = await userInfoService.findOneByEmail(email);
      expect(user === null).toBe(true);
    });
  });
});
