import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskQueue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  task_type: number;

  @Column()
  user_id: string;

  @Column({ nullable: true })
  other_params: string;

  @Column({ type: 'datetime' })
  create_time: Date;

  @Column({ type: 'datetime', nullable: true })
  execute_time: Date;

  @Column({ default: 0 })
  execute_status: number;

  @Column({ nullable: true })
  execute_result: string;
}
