import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { History } from '../db/entitys/history.entity';
import { TaskQueue } from '../db/entitys/task.queue.entity';
import { UserInfo } from '../db/entitys/user.info.entity';
import { UserMonitor } from '../db/entitys/user.monitor.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASE'),
      entities: [History, TaskQueue, UserInfo, UserMonitor],
      logging: this.configService.get('DB_LOGGING'),
      extra: {
        connectionTimeout: 10000,
      },
      synchronize: false,
    };
  }
}
