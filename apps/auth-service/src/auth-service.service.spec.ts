import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceService } from './auth-service.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthUser } from './auth-user.entity';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthServiceService', () => {
  let service: AuthServiceService;
  let mockAuthUserRepository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
  };
  let mockJwtService: { signAsync: jest.Mock };

  beforeEach(async () => {
    mockAuthUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    mockJwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthServiceService,
        {
          provide: getRepositoryToken(AuthUser),
          useValue: mockAuthUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthServiceService>(AuthServiceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      mockAuthUserRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      const newUser = {
        id: 'uuid-1',
        email: 'test@test.com',
        password_hash: 'hashedPassword',
      };
      mockAuthUserRepository.create.mockReturnValue(newUser);
      mockAuthUserRepository.save.mockResolvedValue(newUser);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.register({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toHaveProperty('id', 'uuid-1');
      expect(result).toHaveProperty('access_token', 'token');
    });

    it('should throw ConflictException if email exists', async () => {
      mockAuthUserRepository.findOne.mockResolvedValue({
        email: 'test@test.com',
      });

      await expect(
        service.register({ email: 'test@test.com', password: 'password' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should successfully login user and return tokens', async () => {
      const existingUser = {
        id: 'uuid-1',
        email: 'test@test.com',
        password_hash: 'hashedPassword',
      };
      mockAuthUserRepository.findOne.mockResolvedValue(existingUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.login({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toHaveProperty('access_token', 'token');
      expect(result).toHaveProperty('refresh_token', 'token');
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      mockAuthUserRepository.findOne.mockResolvedValue({
        email: 'test@test.com',
        password_hash: 'hash',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
