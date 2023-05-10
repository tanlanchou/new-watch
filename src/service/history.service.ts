import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from '../db/entitys/history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async create(historyData: Partial<History>): Promise<History> {
    const history = await this.historyRepository.create(historyData);
    return await this.historyRepository.save(history);
  }

  async createBulk(historyDataList: Partial<History>[]): Promise<void> {
    await this.historyRepository.insert(historyDataList);
  }

  async findAll(): Promise<History[]> {
    return await this.historyRepository.find();
  }

  async findOne(id: number): Promise<History> {
    return await this.historyRepository.findOne({ where: { id } });
  }

  async update(id: number, newData: Partial<History>): Promise<History> {
    const history = await this.historyRepository.findOne({ where: { id } });
    if (!history) {
      throw new Error(`History with id ${id} not found.`);
    }
    await this.historyRepository.merge(history, newData);
    return await this.historyRepository.save(history);
  }

  async remove(id: number): Promise<void> {
    const history = await this.historyRepository.findOne({ where: { id } });
    if (!history) {
      throw new Error(`History with id ${id} not found.`);
    }
    await this.historyRepository.remove(history);
  }

  async removeAll(id: string): Promise<void> {
    const historys = await this.historyRepository.find({
      where: { user_id: id },
    });
    await this.historyRepository.remove(historys);
  }

  async findByTaskTypeAndUserId(
    taskType: number,
    userId: string,
  ): Promise<History[]> {
    return await this.historyRepository.find({
      where: {
        task_type: taskType,
        user_id: userId,
      },
    });
  }
}
