import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TasksService } from '../tasks.service';

@Injectable()
export class TaskOwnerOrAdminGuard implements CanActivate {
  constructor(
    private readonly tasksService: TasksService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;

    const taskId = parseInt(params.id, 10);
    const task = await this.tasksService.findOne(taskId);

    if (!task) {
      throw new ForbiddenException('Tarea no encontrada');
    }

    // allow only if is user owner or admin jeje
    if (task.user.id === user.userId || user.role === 'admin') {
      return true;
    }

    throw new ForbiddenException('No tienes permiso para esta acción');
  }
}
