import { Test, TestingModule } from '@nestjs/testing';
import { TaskQueueService } from './task.queue.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskQueue } from '../db/entitys/task.queue.entity';

describe('TaskQueueService', () => {
  let taskQueueService: TaskQueueService;
  let taskQueueRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskQueueService,
        {
          provide: getRepositoryToken(TaskQueue),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    taskQueueService = module.get<TaskQueueService>(TaskQueueService);
    taskQueueRepository = module.get(getRepositoryToken(TaskQueue));
  });

  describe('findAll', () => {
    it('should return an array of task queues', async () => {
      const taskQueues = [{ id: 1, name: 'test task queue' }];
      taskQueueRepository.find.mockReturnValue(taskQueues);
      expect(await taskQueueService.findAll()).toBe(taskQueues);
    });
  });

  describe('findById', () => {
    it('should return a task queue by id', async () => {
      const taskQueue = { id: 1, name: 'test task queue' };
      taskQueueRepository.findOne.mockReturnValue(taskQueue);
      expect(await taskQueueService.findById(1)).toBe(taskQueue);
    });
  });

  describe('create', () => {
    it('should create a task queue', async () => {
      const taskQueue = { name: 'test task queue', task_type: 1, user_id: '1' };
      taskQueueRepository.findOne.mockReturnValue(null);
      taskQueueRepository.save.mockReturnValue(taskQueue);
      expect(await taskQueueService.create(taskQueue)).toBe(taskQueue);
      expect(taskQueueRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'test task queue',
          task_type: 1,
          user_id: '1',
        }),
      );
    });

    it('should not create a task queue if it already exists', async () => {
      const taskQueue = { name: 'test task queue', task_type: 1, user_id: '1' };
      taskQueueRepository.findOne.mockReturnValue(taskQueue);
      expect(await taskQueueService.create(taskQueue)).toBe(null);
      expect(taskQueueRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a task queue', async () => {
      const taskQueue = {
        id: 1,
        name: 'test task queue',
        task_type: 1,
        user_id: '1',
        other_params: '',
        create_time: new Date(),
        execute_time: new Date(),
        execute_status: 1,
        execute_result: '',
      };
      taskQueueRepository.update.mockReturnValue({ affected: 1 });
      taskQueueRepository.findOne.mockReturnValue(taskQueue);
      expect(await taskQueueService.update(1, taskQueue)).toBe(taskQueue);
      expect(taskQueueRepository.update).toHaveBeenCalledWith(1, taskQueue);
    });
  });

  describe('delete', () => {
    it('should delete a task queue', async () => {
      taskQueueRepository.delete.mockReturnValue({ affected: 1 });
      expect(await taskQueueService.delete(1)).toBe(undefined);
      expect(taskQueueRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
