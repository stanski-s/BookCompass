import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserServiceService } from './user-service.service';
import { User } from './user.entity';

describe('UserServiceService', () => {
  let service: UserServiceService;

  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) => Promise.resolve({ id: 1, ...user })),
    find: jest.fn().mockResolvedValue([
      {
        id: 1,
        email: 'test@test.com',
        username: 'testuser',
        passwordHash: 'hash',
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserServiceService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserServiceService>(UserServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user with hashed password', async () => {
    const dto = {
      email: 'test@test.com',
      password: 'pass',
      username: 'testuser',
    };
    const result = await service.create(dto);
    expect(result.id).toBe(1);
    expect(result.email).toBe('test@test.com');
    expect(result.username).toBe('testuser');
    expect(result.passwordHash).not.toBe('pass');
    expect(await bcrypt.compare('pass', result.passwordHash)).toBeTruthy();
  });

  it('should find all users', async () => {
    const result = await service.findAll();
    expect(result.length).toBe(1);
    expect(result[0].email).toBe('test@test.com');
  });
});
