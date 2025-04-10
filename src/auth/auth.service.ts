import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto) {
    try {
      const existingUser = await this.usersService.findByEmail(userDto.email);
      if (existingUser) {
        throw new ConflictException('El correo ya está registrado');
      }

      const hashedPassword = await bcrypt.hash(userDto.password, 10); //get a basic hash with salt 10 as standards to encrypt the password

      const userData = {
        email: userDto.email,
        password: hashedPassword,
        name: userDto.name,
        role: Role.User,
      };

      const newUser = await this.usersService.create(userData);

      return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error interno en Auth:', error);

      throw new InternalServerErrorException(
        'Ocurrió un error al registrar el usuario',
      );
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);

      const passwordValid =
        user && (await bcrypt.compare(password, user.password));
      if (!passwordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      return {
        message: 'Login exitoso',
        data: {
          accessToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      console.error('Error en AuthService.login:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error durante el login',
      );
    }
  }
}
