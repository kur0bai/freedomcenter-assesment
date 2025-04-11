import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  async findAll(user: User): Promise<Task[]> {
    try {
      if (user.role === 'admin') {
        return this.taskRepo.find({ relations: ['user'] });
      }
      // only user tasks :)
      return this.taskRepo.find({
        where: { user: { id: user.id } },
        relations: ['user'],
      });
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      throw new InternalServerErrorException(
        'No se pudieron obtener las tareas',
      );
    }
  }

  async findOne(id: number): Promise<Task> {
    try {
      const task = await this.taskRepo.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!task) {
        throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
      }
      return task;
    } catch (error) {
      console.error('Error finding task:', error);
      throw new InternalServerErrorException('No se pudo encontrar la tarea');
    }
  }

  async create(data: CreateTaskDto, userId: number): Promise<Task> {
    try {
      const task = this.taskRepo.create({ ...data, user: { id: userId } });
      return await this.taskRepo.save(task);
    } catch (error) {
      console.error('Error creating task:', error);
      throw new InternalServerErrorException('No se pudo crear la tarea');
    }
  }
  async update(id: number, dto: UpdateTaskDto, user: User): Promise<Task> {
    try {
      console.log('us', user);
      const task = await this.findOne(id);
      // partial update
      Object.assign(task, dto);
      return await this.taskRepo.save(task);
    } catch (error) {
      console.error('Error updating task:', error);
      throw new InternalServerErrorException('No se pudo actualizar la tarea');
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const task = await this.findOne(id);
      await this.taskRepo.remove(task);
      return { message: 'Tarea eliminada exitosamente' };
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new InternalServerErrorException('No se pudo eliminar la tarea');
    }
  }
}
