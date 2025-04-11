import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { CreateAdminDto } from './dto/create-user-admin.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  //find all users
  async findAll(): Promise<User[]> {
    try {
      return await this.userRepo.find();
    } catch (error) {
      console.error('Error finding all users:', error);
      throw new InternalServerErrorException(
        'No se pudieron encontrar los usuarios',
      );
    }
  }

  //find one user by id
  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new InternalServerErrorException('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw new InternalServerErrorException('No se pudo encontrar el usuario');
    }
  }

  //Create a simple user with email, password and role, thinking in make user by default
  async create(user: CreateUserDto): Promise<User> {
    const newUser = this.userRepo.create({ ...user });
    try {
      return await this.userRepo.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        // existing email
        throw new ConflictException('El email ya está registrado');
      }
      console.error('Error al guardar usuario:', error);
      throw new InternalServerErrorException('No se pudo registrar el usuario');
    }
  }

  //Create admin
  async createAdmin(dto: CreateAdminDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const adminUser = {
        ...dto,
        password: hashedPassword,
        role: Role.Admin,
      };

      return this.create(adminUser);
    } catch (error) {
      if (error.code === '23505') {
        // existing email
        throw new ConflictException('El email ya está registrado');
      }
      console.error('Error al guardar usuario:', error);
      throw new InternalServerErrorException('No se pudo registrar el usuario');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return this.userRepo.findOne({ where: { email } });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new InternalServerErrorException(
        'No se pudo encontrar el usuario por email',
      );
    }
  }

  async update(id: number, user: UpdateUserDto): Promise<User> {
    try {
      await this.userRepo.update(id, user);
      const existingUser = await this.userRepo.findOne({ where: { id } });
      if (!existingUser) {
        throw new InternalServerErrorException('Usuario no encontrado');
      }
      return existingUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new InternalServerErrorException(
        'No se pudo actualizar el usuario',
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.userRepo.delete(id);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new InternalServerErrorException('No se pudo eliminar el usuario');
    }
  }
}
