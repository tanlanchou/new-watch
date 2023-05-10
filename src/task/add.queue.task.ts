import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserMonitorService } from '../service/user.monitor.service';
import { TaskQueueService } from '../service/task.queue.service';
import { TaskQueue } from '../db/entitys/task.queue.entity';

@Injectable()
export class AddQueueTask {
  constructor(
    private readonly userMonitorService: UserMonitorService,
    private readonly taskQueueService: TaskQueueService,
  ) {}

  @Cron('0 * * * * *')
  async handleCron() {
    const monitors = await this.userMonitorService.findExpiredUserMonitors();
    for (const monitor of monitors) {
      const taskQueue = new TaskQueue();
      taskQueue.task_type = monitor.task_type;
      taskQueue.user_id = monitor.user_id;
      taskQueue.create_time = new Date();
      taskQueue.name = ``;
      await this.taskQueueService.create(taskQueue);

      monitor.last_executed = new Date();
      await this.userMonitorService.update(monitor.id, monitor);
    }
  }
}
