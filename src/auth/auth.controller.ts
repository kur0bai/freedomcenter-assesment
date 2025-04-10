import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; role?: Role }) {
    return this.authService.register(body.email, body.password, body.role);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

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
