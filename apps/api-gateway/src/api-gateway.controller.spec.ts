import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';

describe('ApiGatewayController', () => {
  let controller: ApiGatewayController;

  beforeEach(async () => {
    const mockService = {
      getHello: jest.fn().mockReturnValue('API Gateway is working!'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiGatewayController],
      providers: [
        { provide: ApiGatewayService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ApiGatewayController>(ApiGatewayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
