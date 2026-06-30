import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceService } from './user-service.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';

describe('UserServiceService', () => {
  let service: UserServiceService;
  let mockUserRepository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
  };
  let mockCartItemRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    mockCartItemRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserServiceService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: mockCartItemRepository,
        },
      ],
    }).compile();

    service = module.get<UserServiceService>(UserServiceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    it('should return cart items for a user', async () => {
      const mockCart = [{ id: 1, bookId: 2, quantity: 1 }];
      mockCartItemRepository.find.mockResolvedValue(mockCart);

      const result = await service.getCart('uuid-1');
      expect(result).toEqual(mockCart);
      expect(mockCartItemRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 'uuid-1' } },
      });
    });
  });

  describe('addToCart', () => {
    it('should create new cart item if book not in cart', async () => {
      mockCartItemRepository.findOne.mockResolvedValue(null);
      const mockCartItem = { user: { id: 'uuid-1' }, bookId: 1, quantity: 2 };
      mockCartItemRepository.create.mockReturnValue(mockCartItem);
      mockCartItemRepository.save.mockResolvedValue({ id: 1, ...mockCartItem });

      const result = await service.addToCart('uuid-1', 1, 2);
      expect(result).toHaveProperty('id', 1);
      expect(mockCartItemRepository.create).toHaveBeenCalledWith({
        user: { id: 'uuid-1' },
        bookId: 1,
        quantity: 2,
      });
    });

    it('should increment quantity if book already in cart', async () => {
      const existingItem = {
        id: 1,
        user: { id: 'uuid-1' },
        bookId: 1,
        quantity: 2,
      };
      mockCartItemRepository.findOne.mockResolvedValue(existingItem);
      mockCartItemRepository.save.mockResolvedValue({
        ...existingItem,
        quantity: 4,
      });

      const result = await service.addToCart('uuid-1', 1, 2);
      expect(result.quantity).toBe(4);
      expect(existingItem.quantity).toBe(4); // mutated in service
      expect(mockCartItemRepository.save).toHaveBeenCalledWith(existingItem);
    });
  });
});
