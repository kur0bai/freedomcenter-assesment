import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { Role } from './common/enums/role.enum';

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin')
  adminRoute(@Request() req) {
    return { message: 'Solo admin', user: req.user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  userRoute(@Request() req) {
    return { message: 'Perfil', user: req.user };
  }
}
