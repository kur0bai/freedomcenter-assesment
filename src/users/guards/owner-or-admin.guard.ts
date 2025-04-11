import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class UserOwnerOrAdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;

    const userId = parseInt(params.id, 10);
    const targetUser = await this.usersService.findOne(userId);

    if (!targetUser) {
      throw new ForbiddenException('Usuario no encontrado');
    }

    if (user.userId === targetUser.id || user.role === 'admin') {
      return true;
    }

    throw new ForbiddenException('No tienes permiso para esta acción');
  }
}
