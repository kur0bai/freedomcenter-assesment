import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { TaskStatus } from 'src/common/enums/task.enum';

export class UpdateTaskDto {
  @ApiProperty({
    example: 'Ir a comprar pan',
    description: 'Título principal de la tarea',
    required: true,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Comprar pan en la tienda de la esquina',
    required: true,
    description: 'Descripción de la tarea',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'DONE',
    required: true,
    description: 'Estado de la tarea',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    required: true,
    description: 'Fecha de la tarea',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
