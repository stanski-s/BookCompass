import { Test, TestingModule } from '@nestjs/testing';
import { OrderServiceService } from './order-service.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { HttpException } from '@nestjs/common';
import { of } from 'rxjs';

describe('OrderServiceService', () => {
  let service: OrderServiceService;
  let mockOrderRepository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
  };
  let mockOrderItemRepository: { create: jest.Mock; save: jest.Mock };
  let mockUserClient: { send: jest.Mock; emit: jest.Mock };
  let mockBookClient: { send: jest.Mock };

  beforeEach(async () => {
    mockOrderRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    mockOrderItemRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    mockUserClient = {
      send: jest.fn(),
      emit: jest.fn(),
    };

    mockBookClient = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderServiceService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
        {
          provide: 'USER_SERVICE',
          useValue: mockUserClient,
        },
        {
          provide: 'BOOK_SERVICE',
          useValue: mockBookClient,
        },
      ],
    }).compile();

    service = module.get<OrderServiceService>(OrderServiceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkout', () => {
    it('should throw an error if cart is empty', async () => {
      mockUserClient.send.mockReturnValue(of([]));

      await expect(service.checkout('uuid-1')).rejects.toThrow(HttpException);
      await expect(service.checkout('uuid-1')).rejects.toThrow('Cart is empty');
    });

    it('should successfully create an order', async () => {
      const mockCart = [{ bookId: 1, quantity: 2 }];
      mockUserClient.send.mockReturnValue(of(mockCart));

      const mockBook = { id: 1, price: 10.0 };
      mockBookClient.send.mockReturnValue(of(mockBook));

      const mockOrder = {
        userId: 'uuid-1',
        totalAmount: 20.0,
        status: OrderStatus.COMPLETED,
      };

      const savedOrder = { id: 'order-1', ...mockOrder };
      mockOrderRepository.create.mockReturnValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(savedOrder);

      mockOrderItemRepository.create.mockReturnValue({});
      mockOrderItemRepository.save.mockResolvedValue({});

      const result = await service.checkout('uuid-1');

      expect(result).toHaveProperty('id', 'order-1');
      expect(result.totalAmount).toBe(20.0);
      expect(mockUserClient.emit).toHaveBeenCalledWith(
        'user.clearCart',
        'uuid-1',
      );
    });

    it('should throw an error if a book is not found', async () => {
      const mockCart = [{ bookId: 99, quantity: 1 }];
      mockUserClient.send.mockReturnValue(of(mockCart));

      mockBookClient.send.mockReturnValue(of(null));

      await expect(service.checkout('uuid-1')).rejects.toThrow(HttpException);
    });
  });
});
