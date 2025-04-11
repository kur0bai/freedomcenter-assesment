import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';
import { Task } from 'src/tasks/entities/task.entity';

@Entity()
@Unique(['email'])
export class User {
  // Basic user entity with email, more easy to work
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  // adding relatiionship with tasks
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;
}
