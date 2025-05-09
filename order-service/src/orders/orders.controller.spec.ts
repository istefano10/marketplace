import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderStatus } from './schemas/order.schema';
import { BadRequestException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Types } from 'mongoose';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;
  const defaultOrderDto = {
    orderId: 'order-123',  // ID único para cada prueba
    productId: 'product-123',
    customerId: 'customer-123',
    sellerId: 'seller-123',
    price: 100,
    quantity: 2,
    status: OrderStatus.CREATED, // El status inicial
  }
  const mockOrdersService = {
    createOrder: jest.fn(),
    getOrders: jest.fn(),
    getOrder: jest.fn(),
    updateOrderStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: OrdersService, useValue: mockOrdersService },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const createOrderDto: CreateOrderDto = defaultOrderDto;  // Usamos la constante
      const result = { ...createOrderDto, _id: 'order-id' };

      mockOrdersService.createOrder.mockResolvedValue(result);

      expect(await controller.createOrder(createOrderDto)).toEqual(result);
    });

    it('should throw BadRequestException if there is an error', async () => {
      const createOrderDto: CreateOrderDto = defaultOrderDto;

      mockOrdersService.createOrder.mockRejectedValue(new Error('Error creating order'));

      try {
        await controller.createOrder(createOrderDto);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(e.message).toBe('Error creating order');
      }
    });
  });

  describe('getOrders', () => {
    it('should return a list of orders', async () => {
      const result = [
        { orderId: 'order-123', productId: 'product-123', status: OrderStatus.CREATED },
      ];

      mockOrdersService.getOrders.mockResolvedValue(result);

      expect(await controller.getOrders()).toEqual(result);
    });

    it('should throw InternalServerErrorException if there is an error', async () => {
      mockOrdersService.getOrders.mockRejectedValue(new Error('Error retrieving orders'));

      try {
        await controller.getOrders();
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(e.message).toBe('Error retrieving orders');
      }
    });
  });

  describe('getOrder', () => {
    it('should return a single order', async () => {
      const validOrderId = new Types.ObjectId().toString();  // Genera un ObjectId válido
      const order = { orderId: 'order-123', productId: 'product-123', customerId: 'customer-123', sellerId: 'seller-123', price: 100, quantity: 2, status: 'CREATED' };
    
      mockOrdersService.getOrder.mockResolvedValue(order); // Simulamos que se encuentra la orden
    
      const result = await controller.getOrder(validOrderId);
      expect(result).toEqual(order);
    });

    it('should throw BadRequestException if the ID is invalid', async () => {
      try {
        await controller.getOrder('invalid-id');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Invalid order ID format');
      }
    });

    it('should throw BadRequestException if the order ID format is invalid', async () => {
      const invalidOrderId = 'invalid-id';  // ID inválido para ObjectId
    
      try {
        await controller.getOrder(invalidOrderId);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Invalid order ID format');
      }
    });

    it('should throw NotFoundException if the order is not found', async () => {
      const validOrderId = '60d3b41abdacab002f8f14a1';  // Este debe ser un ObjectId válido
      const mockOrderService = mockOrdersService.getOrder.mockResolvedValue(null);  // Simula que no se encuentra la orden
    
      try {
        await controller.getOrder(validOrderId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`Order with id ${validOrderId} not found`);
      }
    });
    
  });

  describe('updateOrderStatus', () => {
    it('should update the order status successfully', async () => {
      const orderId = 'order-123';
      const status = { status: OrderStatus.ACCEPTED };  // Usamos un valor válido de la enumeración
      const result = { orderId, status: OrderStatus.ACCEPTED };

      mockOrdersService.updateOrderStatus.mockResolvedValue(result);

      expect(await controller.updateOrderStatus(orderId, status)).toEqual(result);
    });

    it('should throw BadRequestException if the status is invalid', async () => {
      const orderId = 'order-123';
      const invalidStatus: any = { status: 'INVALID_STATUS' };

      try {
        await controller.updateOrderStatus(orderId, invalidStatus);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Invalid order status');
      }
    });

    it('should throw NotFoundException if the order is not found', async () => {
      const orderId = 'order-123';
      const status = { status: OrderStatus.ACCEPTED };

      mockOrdersService.updateOrderStatus.mockRejectedValue(new NotFoundException('Order not found'));

      try {
        await controller.updateOrderStatus(orderId, status);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`Order with id ${orderId} not found`);
      }
    });
  });


});
