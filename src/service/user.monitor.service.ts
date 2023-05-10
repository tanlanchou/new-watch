import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMonitor } from '../db/entitys/user.monitor.entity';
import { socialType } from '../enums';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserMonitorService {
  constructor(
    @InjectRepository(UserMonitor)
    private userMonitorRepository: Repository<UserMonitor>,
    private configService: ConfigService,
  ) {}

  async create(
    userMonitor: Partial<UserMonitor> = {
      task_type: socialType.weibo,
      last_executed: null,
      interval_time: this.configService.get('INTERVAL_TIME_NORMAL'),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ): Promise<UserMonitor> {
    return await this.userMonitorRepository.save(userMonitor);
  }

  async findAll(): Promise<UserMonitor[]> {
    return await this.userMonitorRepository.find();
  }

  async findById(id: number): Promise<UserMonitor> {
    return await this.userMonitorRepository.findOne({ where: { id } });
  }

  async findByLocalUserId(localUserId: number): Promise<UserMonitor> {
    return await this.userMonitorRepository.findOne({
      where: { local_user_id: localUserId },
    });
  }

  async update(id: number, userMonitor: UserMonitor): Promise<UserMonitor> {
    await this.userMonitorRepository.update(id, userMonitor);
    return await this.userMonitorRepository.findOne({ where: { id } });
  }

  async updateTime(userId: string) {
    const results = await this.userMonitorRepository.find({
      where: { user_id: userId },
    });

    if (results.length === 1) {
      const result = results[0];
      result.last_executed = new Date();
      result.updated_at = new Date();

      await this.userMonitorRepository.update(result.id, result);
      return;
    }

    throw new Error(
      `results 数组长度不正确，length: ${results.length}, results: ${results}`,
    );
  }

  async delete(id: number): Promise<void> {
    await this.userMonitorRepository.delete(id);
  }

  async findExpiredUserMonitors(): Promise<UserMonitor[]> {
    const qb = this.userMonitorRepository.createQueryBuilder('user_monitor');
    return await qb
      .where('user_monitor.last_executed IS NULL')
      .orWhere(
        'TIMESTAMPDIFF(MINUTE, user_monitor.last_executed, NOW()) > user_monitor.interval_time',
      )
      .getMany();
  }

  async findAllLocalUserIdByUserId(userId: string): Promise<UserMonitor[]> {
    const results = await this.userMonitorRepository.find({
      where: { user_id: userId },
    });

    return results;
  }
}
