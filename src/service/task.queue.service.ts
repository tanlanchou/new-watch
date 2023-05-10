import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskQueue } from '../db/entitys/task.queue.entity';
import { executeStatus } from '../enums';

@Injectable()
export class TaskQueueService {
  constructor(
    @InjectRepository(TaskQueue)
    private readonly taskQueueRepository: Repository<TaskQueue>,
  ) {}

  async create(
    taskQueue: Partial<TaskQueue> = {
      create_time: new Date(),
    },
  ): Promise<TaskQueue | null> {
    const existingTaskQueue = await this.taskQueueRepository.findOne({
      where: { task_type: taskQueue.task_type, user_id: taskQueue.user_id },
    });

    if (existingTaskQueue) {
      return null;
    }

    return await this.taskQueueRepository.save(taskQueue);
  }

  async creates(
    taskQueues: Partial<TaskQueue>[] = [
      {
        create_time: new Date(),
      },
    ],
  ): Promise<TaskQueue[]> {
    const existingTaskQueues = await Promise.all(
      taskQueues.map((taskQueue) =>
        this.taskQueueRepository.findOne({
          where: {
            task_type: taskQueue.task_type,
            user_id: taskQueue.user_id,
          },
        }),
      ),
    );

    const newTaskQueues = taskQueues.filter(
      (_, index) => !existingTaskQueues[index],
    );

    return await this.taskQueueRepository.save(newTaskQueues);
  }

  async findAll(): Promise<TaskQueue[]> {
    return await this.taskQueueRepository.find();
  }

  async findById(id: number): Promise<TaskQueue> {
    return await this.taskQueueRepository.findOne({ where: { id } });
  }

  async update(id: number, taskQueue: TaskQueue): Promise<TaskQueue> {
    await this.taskQueueRepository.update(id, taskQueue);
    return await this.taskQueueRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.taskQueueRepository.delete(id);
  }

  async findUnExecByCount(n = 500): Promise<TaskQueue[]> {
    return await this.taskQueueRepository.find({
      take: n,
      where: { execute_status: executeStatus.unExec },
    });
  }

  async findUnExecAndErrorByCount(n = 500): Promise<TaskQueue[]> {
    return await this.taskQueueRepository
      .createQueryBuilder('task_queue')
      .where('task_queue.execute_status IN (:...statuses)', {
        statuses: [executeStatus.unExec, executeStatus.error],
      })
      .take(n)
      .getMany();
  }
}
