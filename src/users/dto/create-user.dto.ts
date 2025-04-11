import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'arnulfo@mail.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'contraseñaSegura123',
    description: 'Contraseña del usuario',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Arnulfo Gutierrez',
    description: 'Nombre completo del usuario',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'user',
    description: 'Rol del usuario',
  })
  @IsEnum(Role)
  role: Role;
}
