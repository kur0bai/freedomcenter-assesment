import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { TaskOwnerOrAdminGuard } from './guards/task-owner.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Req() req) {
    return this.tasksService.findAll(req.user);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @Roles(Role.User, Role.Admin)
  async create(@Body() task: CreateTaskDto, @Req() req) {
    const userId = req.user.userId;
    return this.tasksService.create(task, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin) // solo user o admin pueden actualizar
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Request() req,
  ) {
    const user = req.user;
    const updatedTask = await this.tasksService.update(id, dto, user);
    return {
      message: 'Tarea actualizada exitosamente',
      data: updatedTask,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.tasksService.remove(id);
  }
}
