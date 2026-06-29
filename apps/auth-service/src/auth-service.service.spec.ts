import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthServiceService } from './auth-service.service';

describe('AuthServiceService', () => {
  let service: AuthServiceService;
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthServiceService,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthServiceService>(AuthServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a jwt token when logging in', () => {
    const user = { username: 'testuser', id: 1 };
    expect(service.login(user)).toEqual({
      access_token: 'mock-jwt-token',
    });
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      username: 'testuser',
      sub: 1,
    });
  });
});
