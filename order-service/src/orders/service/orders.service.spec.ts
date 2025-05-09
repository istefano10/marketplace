import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getModelToken } from '@nestjs/mongoose';
import { RmqService } from '../rmq/rmq.service';
import { Order, OrderStatus } from '../schemas/order.schema';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

// Mock Order instance
const mockSavedOrder = {
  _id: '1',
  orderId: 'order123',
  productId: 'prod456',
  customerId: 'cust789',
  sellerId: 'seller101',
  price: 50,
  quantity: 2,
  status: OrderStatus.CREATED,
  save: jest.fn().mockResolvedValue(this),
};

const mockOrderDto = {
  orderId: 'order123',
  productId: 'prod456',
  customerId: 'cust789',
  sellerId: 'seller101',
  price: 50,
  quantity: 2,
  status: OrderStatus.CREATED,
};

// Factory for new order instances
const orderModelMockFactory = jest.fn().mockImplementation(() => ({
  ...mockOrderDto,
  save: jest.fn().mockResolvedValue(mockSavedOrder),
}));

const mockOrderModel = {
  find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockSavedOrder]) }),
  findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockSavedOrder) }),
  save: jest.fn(),
  exec: jest.fn(),
};

const rmqServiceMock = {
  emitOrderShipped: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken('Order'),
          useValue: Object.assign(orderModelMockFactory, mockOrderModel),
        },
        {
          provide: RmqService,
          useValue: rmqServiceMock,
        },
        {
          provide: getModelToken(Order.name), // <- aquí usamos Order.name en lugar de 'Order'
          useValue: Object.assign(orderModelMockFactory, mockOrderModel),
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('createOrder', () => {
    it('should create an order', async () => {
      const result = await service.createOrder(mockOrderDto);
      expect(result).toEqual(mockSavedOrder);
      expect(orderModelMockFactory).toHaveBeenCalledWith(mockOrderDto);
    });

    it('should throw BadRequestException on error', async () => {
      orderModelMockFactory.mockImplementationOnce(() => {
        throw new Error('mock error');
      });

      await expect(service.createOrder(mockOrderDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getOrders', () => {
    it('should return orders', async () => {
      const result = await service.getOrders();
      expect(result).toEqual([mockSavedOrder]);
      expect(mockOrderModel.find).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockOrderModel.find.mockReturnValueOnce({
        exec: jest.fn().mockRejectedValueOnce(new Error('fail')),
      });

      await expect(service.getOrders()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getOrder', () => {
    it('should return a single order', async () => {
      const result = await service.getOrder('1');
      expect(result).toEqual(mockSavedOrder);
    });

    it('should throw NotFoundException if not found', async () => {
      mockOrderModel.findById.mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(null) });
      await expect(service.getOrder('123')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on invalid ID', async () => {
      const error = new Error('CastError');
      error.name = 'CastError';
      mockOrderModel.findById.mockReturnValueOnce({ exec: jest.fn().mockRejectedValueOnce(error) });
      await expect(service.getOrder('invalid-id')).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status and emit event if SHIPPED', async () => {
      const updatedOrder = { ...mockSavedOrder, status: OrderStatus.SHIPPED, save: jest.fn().mockResolvedValue(mockSavedOrder) };
      mockOrderModel.findById.mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(updatedOrder) });

      const result = await service.updateOrderStatus('1', OrderStatus.SHIPPED);
      expect(updatedOrder.save).toHaveBeenCalled();
      expect(result.status).toBe(OrderStatus.SHIPPED);
      expect(rmqServiceMock.emitOrderShipped).toHaveBeenCalledWith(updatedOrder.orderId);
    });

    it('should throw NotFoundException if not found', async () => {
      mockOrderModel.findById.mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(null) });
      await expect(service.updateOrderStatus('1', OrderStatus.SHIPPED)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on CastError', async () => {
      const error = new Error('CastError');
      error.name = 'CastError';
      mockOrderModel.findById.mockReturnValueOnce({ exec: jest.fn().mockRejectedValueOnce(error) });
      await expect(service.updateOrderStatus('invalid', OrderStatus.SHIPPED)).rejects.toThrow(BadRequestException);
    });
  });
});
