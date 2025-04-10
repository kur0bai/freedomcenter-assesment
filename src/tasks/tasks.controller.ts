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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';

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
    return this.tasksService.findOne(id, req.user);
  }

  @Post()
  @Roles(Role.User, Role.Admin)
  async create(@Body() task: CreateTaskDto, @Req() req) {
    return this.tasksService.create(task, req.user);
  }

  @Patch(':id')
  @Roles(Role.User, Role.Admin)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.tasksService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(Role.User, Role.Admin)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.tasksService.remove(id, req.user);
  }
}
