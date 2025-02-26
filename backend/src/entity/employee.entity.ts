import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Document } from './document.entity';

@Entity('t_employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  job_title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary: number;

  @Column()
  document: string;

  @OneToOne(() => User, user => user.employee)
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @Column({ name: 'user_id' })
  user_id: number;
}