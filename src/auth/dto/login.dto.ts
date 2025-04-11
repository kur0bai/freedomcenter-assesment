import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'arnulfo@mail.com',
    required: true,
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'contraseñaSegura123',
    required: true,
    description: 'Contraseña del usuario',
  })
  @IsString()
  password: string;
}
