import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';

describe('AuthServiceController', () => {
  let controller: AuthServiceController;
  let service: AuthServiceService;

  beforeEach(async () => {
    const mockService = {
      login: jest.fn().mockReturnValue({ access_token: 'mock-token' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthServiceController],
      providers: [{ provide: AuthServiceService, useValue: mockService }],
    }).compile();

    controller = module.get<AuthServiceController>(AuthServiceController);
    service = module.get<AuthServiceService>(AuthServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service login', () => {
    const dto = { username: 'testuser', password: 'testpassword' };
    // This is mocked purely for endpoint behavior demonstration
    const reqUserMock = { id: 1, username: dto.username };
    expect(controller.login(dto)).toEqual({ access_token: 'mock-token' });
    expect(service.login).toHaveBeenCalledWith(dto);
  });
});
