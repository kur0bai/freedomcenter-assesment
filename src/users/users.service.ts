import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  //Create a simple user with email, password and role, thinking in make user by default
  async create(
    email: string,
    password: string,
    role: Role = Role.User,
  ): Promise<User> {
    const user = this.userRepo.create({ email, password, role });
    return this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
}
