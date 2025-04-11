import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { TaskStatus } from 'src/common/enums/task.enum';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Ir a comprar pan',
    description: 'Título principal de la tarea',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Comprar pan en la tienda de la esquina',
    required: true,
    description: 'Descripción de la tarea',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'DONE',
    required: true,
    description: 'Estado de la tarea',
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    required: true,
    description: 'Fecha de la tarea',
  })
  @IsDateString()
  dueDate: string;
}
