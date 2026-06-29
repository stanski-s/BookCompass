import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserServiceService } from './user-service.service';
import { User } from './user.entity';

describe('UserServiceService', () => {
  let service: UserServiceService;

  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((user) => Promise.resolve({ ...user })),
    find: jest.fn().mockResolvedValue([{ id: 'uuid-123', username: 'testuser', bio: 'hello' } as User]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserServiceService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        }
      ],
    }).compile();

    service = module.get<UserServiceService>(UserServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user profile', async () => {
    const dto = { id: 'uuid-123', username: 'testuser', bio: 'hello' };
    const result = await service.create(dto);
    expect(result.id).toBe('uuid-123');
    expect(result.username).toBe('testuser');
    expect(result.bio).toBe('hello');
  });

  it('should find all users', async () => {
    const result = await service.findAll();
    expect(result.length).toBe(1);
    expect(result[0].username).toBe('testuser');
  });
});
