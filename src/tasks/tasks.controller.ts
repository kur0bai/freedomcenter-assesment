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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TaskOwnerOrAdminGuard } from './guards/task-owner.guard';
import {
  ApiHeader,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Obtiene una lista de tareas' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado, header de autorización falta o es inválido',
  })
  async findAll(@Req() req) {
    return this.tasksService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una tarea' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado, header de autorización falta o es inválido',
  })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.tasksService.findOne(id);
  }

  /* Create task, trying to upload images using multer :P */
  @Post()
  @ApiOperation({ summary: 'Crear una tarea' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado, header de autorización falta o es inválido',
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/tasks',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `task-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @Roles(Role.User, Role.Admin)
  async create(
    @Body() task: CreateTaskDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.tasksService.create(task, userId, image?.filename);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza una tarea' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado, header de autorización falta o es inválido',
  })
  @UseGuards(JwtAuthGuard, RolesGuard, TaskOwnerOrAdminGuard)
  @Roles(Role.User, Role.Admin) // only user or admin
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/tasks',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdateTaskDto,
    @UploadedFile() image: Express.Multer.File,
    @Request() req,
  ) {
    const user = req.user;
    const taskData = {
      ...task,
      ...(image ? { image: image.filename } : {}),
    };
    const updatedTask = await this.tasksService.update(id, task, user);
    return {
      message: 'Tarea actualizada exitosamente',
      data: updatedTask,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una tarea' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado, header de autorización falta o es inválido',
  })
  @UseGuards(JwtAuthGuard, RolesGuard, TaskOwnerOrAdminGuard)
  @Roles(Role.User, Role.Admin)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.tasksService.remove(id);
  }
}
