import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';

@Entity()
export class User {
  // Basic user entity with email, more easy to work
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;
}
