import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { User } from './user.entity';

describe('UserServiceController', () => {
  let controller: UserServiceController;
  let service: UserServiceService;

  beforeEach(async () => {
    const mockService = {
      getHello: jest.fn().mockReturnValue('Hello World!'),
      create: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserServiceController],
      providers: [{ provide: UserServiceService, useValue: mockService }],
    }).compile();

    controller = module.get<UserServiceController>(UserServiceController);
    service = module.get<UserServiceService>(UserServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('users', () => {
    it('should create a user', async () => {
      const result = { id: 1, email: 'test@test.com', username: 'testuser', passwordHash: 'hash' } as User;
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create({ email: 'test@test.com', username: 'testuser', password: 'pass' })).toBe(result);
    });

    it('should find all users', async () => {
      const result = [{ id: 1, email: 'test@test.com', username: 'testuser', passwordHash: 'hash' } as User];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });
});
