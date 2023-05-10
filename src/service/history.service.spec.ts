import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from '../db/entitys/history.entity';
import { HistoryService } from './history.service';

describe('HistoryService', () => {
  let historyService: HistoryService;
  let historyRepository: Repository<History>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        {
          provide: getRepositoryToken(History),
          useClass: Repository,
        },
      ],
    }).compile();

    historyService = module.get<HistoryService>(HistoryService);
    historyRepository = module.get<Repository<History>>(
      getRepositoryToken(History),
    );
  });

  it('should be defined', () => {
    expect(historyService).toBeDefined();
  });

  describe('create', () => {
    it('should create a history', async () => {
      const historyData = {
        index: 1,
        user_id: 'user1',
        task_type: 1,
        content: 'test content',
      };
      const history = new History();
      history.index = historyData.index;
      history.user_id = historyData.user_id;
      history.task_type = historyData.task_type;
      history.content = historyData.content;
      jest.spyOn(historyRepository, 'create').mockReturnValue(history);
      jest.spyOn(historyRepository, 'save').mockResolvedValue(history);
      expect(await historyService.create(historyData)).toEqual(history);
    });
  });

  describe('findAll', () => {
    it('should return an array of histories', async () => {
      const history = new History();
      jest.spyOn(historyRepository, 'find').mockResolvedValue([history]);
      expect(await historyService.findAll()).toEqual([history]);
    });
  });

  describe('findOne', () => {
    it('should return a history', async () => {
      const history = new History();
      jest.spyOn(historyRepository, 'findOne').mockResolvedValue(history);
      expect(await historyService.findOne(1)).toEqual(history);
    });
  });

  describe('update', () => {
    it('should update a history', async () => {
      const historyData = {
        index: 1,
        user_id: 'user1',
        task_type: 1,
        content: 'test content',
      };
      const history = new History();
      history.index = historyData.index;
      history.user_id = historyData.user_id;
      history.task_type = historyData.task_type;
      history.content = historyData.content;
      jest.spyOn(historyRepository, 'findOne').mockResolvedValue(history);
      jest.spyOn(historyRepository, 'merge').mockReturnValue(history);
      jest.spyOn(historyRepository, 'save').mockResolvedValue(history);
      expect(await historyService.update(1, historyData)).toEqual(history);
    });
  });

  describe('remove', () => {
    it('should remove a history', async () => {
      const history = new History();
      jest.spyOn(historyRepository, 'findOne').mockResolvedValue(history);
      jest.spyOn(historyRepository, 'remove').mockResolvedValue(undefined);
      await historyService.remove(1);
      expect(historyRepository.remove).toHaveBeenCalledWith(history);
    });
  });

  describe('findByTaskTypeAndUserId', () => {
    it('should return an array of histories', async () => {
      const history = new History();
      jest.spyOn(historyRepository, 'find').mockResolvedValue([history]);
      expect(await historyService.findByTaskTypeAndUserId(1, 'user1')).toEqual([
        history,
      ]);
    });
  });
});
