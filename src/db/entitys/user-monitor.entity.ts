import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserMonitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column()
  local_user_id: number;

  @Column()
  task_type: number;

  @Column({ nullable: true })
  last_executed: Date;

  @Column()
  interval_time: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
