import {
  Injectable,
  NotFoundException,
  ForbiddenException,
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
    if (user.role === Role.Admin) {
      return this.taskRepo.find({ relations: ['user'] });
    }
    return this.taskRepo.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
  }

  async findOne(id: number, user: User): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    if (user.role !== Role.Admin && task.user.id !== user.id)
      throw new ForbiddenException('No tienes acceso a esta tarea');
    return task;
  }

  async create(task: CreateTaskDto, user: User): Promise<Task> {
    const newTask = this.taskRepo.create({ ...task, user });
    return this.taskRepo.save(newTask);
  }

  async update(id: number, dto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async remove(id: number, user: User): Promise<void> {
    const task = await this.findOne(id, user);
    await this.taskRepo.remove(task);
  }
}
