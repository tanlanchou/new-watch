import { Test, TestingModule } from '@nestjs/testing';
import { UserMonitorService } from './user.monitor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserMonitor } from '../db/entitys/user.monitor.entity';
import { Repository } from 'typeorm';
import { socialType } from '../enums';
import { ConfigService } from '@nestjs/config';

describe('UserMonitorService', () => {
  let service: UserMonitorService;
  let repository: Repository<UserMonitor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMonitorService,
        ConfigService,
        {
          provide: getRepositoryToken(UserMonitor),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserMonitorService>(UserMonitorService);
    repository = module.get<Repository<UserMonitor>>(
      getRepositoryToken(UserMonitor),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new UserMonitor', async () => {
      const userMonitor = {
        local_user_id: 1,
        task_type: socialType.weibo,
        last_executed: null,
        interval_time: 10,
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(repository, 'save').mockResolvedValue(userMonitor as any);
      expect(await service.create(userMonitor)).toEqual(userMonitor);
    });
  });

  describe('findAll', () => {
    it('should return an array of UserMonitors', async () => {
      const userMonitors = [
        {
          local_user_id: 1,
          task_type: socialType.weibo,
          last_executed: null,
          interval_time: 10,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          local_user_id: 2,
          task_type: socialType.weibo,
          last_executed: null,
          interval_time: 10,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(userMonitors as any);
      expect(await service.findAll()).toEqual(userMonitors);
    });
  });

  describe('findById', () => {
    it('should return a UserMonitor by id', async () => {
      const userMonitor = {
        id: 1,
        local_user_id: 1,
        task_type: socialType.weibo,
        last_executed: null,
        interval_time: 10,
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(userMonitor as any);
      expect(await service.findById(1)).toEqual(userMonitor);
    });
  });

  describe('findByLocalUserId', () => {
    it('should return a UserMonitor by local_user_id', async () => {
      const userMonitor = {
        local_user_id: 1,
        task_type: socialType.weibo,
        last_executed: null,
        interval_time: 10,
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(userMonitor as any);
      expect(await service.findByLocalUserId(1)).toEqual(userMonitor);
    });
  });

  describe('update', () => {
    it('should update a UserMonitor', async () => {
      const updatedUserMonitor = {
        id: 1,
        local_user_id: 1,
        user_id: '1703386861',
        task_type: socialType.weibo,
        last_executed: new Date(),
        interval_time: 5,
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(repository, 'update').mockResolvedValue(undefined as any);
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(updatedUserMonitor as any);
      expect(await service.update(1, updatedUserMonitor)).toEqual(
        updatedUserMonitor,
      );
    });
  });

  describe('delete', () => {
    it('should delete a UserMonitor by id', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined as any);
      expect(await service.delete(1)).toBeUndefined();
    });
  });
});
