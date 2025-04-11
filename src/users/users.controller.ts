import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserOwnerOrAdminGuard } from './guards/owner-or-admin.guard';
import { ApiHeader, ApiOperation } from '@nestjs/swagger';
import { CreateAdminDto } from './dto/create-user-admin.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Actualiza un usuario' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @UseGuards(JwtAuthGuard, UserOwnerOrAdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(+id, dto);
  }

  @ApiOperation({ summary: 'Elimina un usuario' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @UseGuards(JwtAuthGuard, UserOwnerOrAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @ApiOperation({
    summary: 'Crear un usuario administrador',
  })
  @Post('admin')
  @UseGuards(AdminGuard)
  async createAdmin(@Body() dto: CreateAdminDto) {
    return this.usersService.createAdmin(dto);
  }
}
