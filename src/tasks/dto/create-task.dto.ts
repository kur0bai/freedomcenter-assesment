import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { TaskStatus } from 'src/common/enums/task.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsDateString()
  dueDate: string;
}
