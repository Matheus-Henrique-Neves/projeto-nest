import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/orderitem.entity';
import { Product } from 'src/products/entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: Repository<Order>;
  let repositoryOrderItem: Repository<OrderItem>;
  let repositoryProduct: Repository<Product>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockRepositoryOrderItem = {
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockRepositoryProduct = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: mockRepository },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockRepositoryOrderItem,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepositoryProduct,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
    repositoryOrderItem = module.get<Repository<OrderItem>>(
      getRepositoryToken(OrderItem),
    );
    repositoryProduct = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('deve calcular o total corretamente', () => {
      const createOrderItemDto: CreateOrderItemDto = {
        quantity: 2,
        productId: 1,
      };
      const createOrderItemDto2: CreateOrderItemDto = {
        quantity: 3,
        productId: 2,
      };
      const createOrderDto: CreateOrderDto = {
        products: [createOrderItemDto, createOrderItemDto2],
        userId: 1,
      };

      const produtos = [
        { id: 1, name: 'Produto 1', price: 10, items: [] },
        { id: 2, name: 'Produto 2', price: 20, items: [] },
      ];

      const result = service.productSum(produtos, createOrderDto);
      expect(result).toEqual(80);
    });
    it('deve criar um pedido', async () => {
      const createOrderItemDTO: CreateOrderItemDto = {
        quantity: 2,
        productId: 1,
      };
      const createOrderItemDTO2: CreateOrderItemDto = {
        quantity: 2,
        productId: 3,
      };
      const createOrderDto: CreateOrderDto = {
        products: [createOrderItemDTO, createOrderItemDTO2],
        userId: 1,
      };
      const produtos = [
        { id: 1, name: 'Produto1', price: 9.0 },
        { id: 2, name: 'Produto2', price: 10.5 },
        { id: 3, name: 'Produto3', price: 20.5 },
      ];

      const orderCreated = { total: 58.5, userId: 1 };
      const orderSaved = { ...orderCreated, id: 1 };

      mockRepositoryProduct.find.mockResolvedValue(produtos);
      mockRepository.create.mockResolvedValue(orderCreated);
      mockRepository.save.mockResolvedValue(orderSaved);

      mockRepositoryOrderItem.create.mockResolvedValue(createOrderItemDTO);
      mockRepositoryOrderItem.save.mockResolvedValue(createOrderItemDTO);

      const result = await service.create(createOrderDto);
      expect(result).toEqual(orderSaved);
    });
  });
});
