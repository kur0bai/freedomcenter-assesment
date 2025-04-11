import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    example: 'arnulfo@mail.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Arnulfo Gutierrez',
    description: 'Nombre completo del usuario',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'contraseñaSegura123',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
