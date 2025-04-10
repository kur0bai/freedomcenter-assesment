import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  //Create a simple user with email, password and role, thinking in make user by default
  async create(user: CreateUserDto): Promise<User> {
    const newUser = this.userRepo.create({ ...user });

    try {
      return await this.userRepo.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        // existing array
        throw new ConflictException('El email ya está registrado');
      }

      console.error('Error al guardar usuario:', error);
      throw new InternalServerErrorException('No se pudo registrar el usuario');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
}
