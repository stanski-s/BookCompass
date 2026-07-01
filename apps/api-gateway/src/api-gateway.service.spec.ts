import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatewayService } from './api-gateway.service';
import { HttpException } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('ApiGatewayService', () => {
  let service: ApiGatewayService;
  let mockAuthClient: { send: jest.Mock };
  let mockUserClient: { send: jest.Mock };
  let mockBookClient: { send: jest.Mock };
  let mockOrderClient: { send: jest.Mock };
  let mockReviewClient: { send: jest.Mock };

  beforeEach(async () => {
    mockAuthClient = { send: jest.fn() };
    mockUserClient = { send: jest.fn() };
    mockBookClient = { send: jest.fn() };
    mockOrderClient = { send: jest.fn() };
    mockReviewClient = { send: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiGatewayService,
        { provide: 'AUTH_SERVICE', useValue: mockAuthClient },
        { provide: 'USER_SERVICE', useValue: mockUserClient },
        { provide: 'BOOK_SERVICE', useValue: mockBookClient },
        { provide: 'ORDER_SERVICE', useValue: mockOrderClient },
        { provide: 'REVIEW_SERVICE', useValue: mockReviewClient },
      ],
    }).compile();

    service = module.get<ApiGatewayService>(ApiGatewayService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register and create a user profile', async () => {
      mockAuthClient.send.mockReturnValue(
        of({ id: 'uuid-1', access_token: 'token', refresh_token: 'refresh' }),
      );
      mockUserClient.send.mockReturnValue(of({ username: 'testuser' }));

      const result = await service.register({
        email: 'test@test.com',
        password: 'pass',
        username: 'testuser',
      });

      expect(result).toHaveProperty('id', 'uuid-1');
      expect(result).toHaveProperty('username', 'testuser');
      expect(result).toHaveProperty('access_token', 'token');
    });

    it('should throw an HttpException if auth service fails', async () => {
      mockAuthClient.send.mockReturnValue(
        throwError(() => new Error('Registration failed')),
      );

      await expect(
        service.register({ email: 'test@test.com', password: 'pass' }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('cart operations', () => {
    it('should get cart items', () => {
      mockUserClient.send.mockReturnValue(of([{ bookId: 1, quantity: 2 }]));
      const result = service.getCart('uuid-1');

      // Since it returns an Observable, we might need to test the observable or the lastValueFrom
      // The controller returns the observable, and NestJS resolves it.
      // We'll just verify the mock was called correctly.
      let cart: unknown;
      result.subscribe((data: unknown) => {
        cart = data;
      });
      expect(cart).toEqual([{ bookId: 1, quantity: 2 }]);
      expect(mockUserClient.send).toHaveBeenCalledWith(
        'user.getCart',
        'uuid-1',
      );
    });
  });

  describe('order operations', () => {
    it('should call checkout', () => {
      mockOrderClient.send.mockReturnValue(of({ id: 'order-1' }));
      const result = service.checkout('uuid-1');

      let order: unknown;
      result.subscribe((data: unknown) => {
        order = data;
      });
      expect(order).toEqual({ id: 'order-1' });
      expect(mockOrderClient.send).toHaveBeenCalledWith(
        'order.checkout',
        'uuid-1',
      );
    });
  });
});
