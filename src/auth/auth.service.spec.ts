import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/common/enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    role: Role.User,
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('Should register new user', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockImplementation((data) => ({
        ...mockUser,
        ...data,
        id: 1,
      }));

      const result = await service.register({
        email: mockUser.email,
        password: 'plaintext',
        name: mockUser.name,
        role: Role.User,
      });

      expect(result).toEqual({
        id: 1,
        email: mockUser.email,
        name: mockUser.name,
        role: Role.User,
      });
    });

    it('The email is already created', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: mockUser.email,
          password: 'plaintext',
          name: mockUser.name,
          role: Role.User,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('Invalid credentials', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login(mockUser.email, 'plaintext');

      expect(result).toEqual({
        message: 'Login exitoso',
        data: {
          accessToken: 'fake-jwt-token',
          user: {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name,
            role: mockUser.role,
          },
        },
      });
    });

    it('This password is wrong', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(mockUser.email, 'wrongpass')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('User doesnt exists', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.login('noexiste@mail.com', 'pass')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
