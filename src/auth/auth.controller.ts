import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: CreateUserDto) {
    const createdUser = await this.authService.register(user);
    return {
      status: 'success',
      message: 'Usuario registrado correctamente',
      data: {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      },
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
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
