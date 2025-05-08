import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { RmqService } from './rmq/rmq.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private rmqService: RmqService
  ) {}

  // Create a new order
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const order = new this.orderModel(createOrderDto);
      return await order.save();
    } catch (error) {
      throw new BadRequestException(
        'Error creating the order: ' + error.message,
      );
    }
  }

  // Get all orders
  async getOrders(): Promise<Order[]> {
    try {
      return await this.orderModel.find().exec();
    } catch (error) {
      throw new BadRequestException(
        'Error retrieving orders: ' + error.message,
      );
    }
  }

  // Get a single order by ID
  async getOrder(id: string): Promise<Order> {
    try {
      const order = await this.orderModel.findById(id).exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid order ID format');
      }
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  // Update the status of an order
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      const order = await this.orderModel.findById(id).exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      order.status = status;
      await order.save();

      // Emit event when the order is shipped
      if (status === OrderStatus.SHIPPED) {
        console.log(order.orderId)
        this.rmqService.emitOrderShipped(order.orderId)
      }

      return order;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid order ID format');
      }
      throw new BadRequestException(
        'Error updating order status: ' + error.message,
      );
    }
  }
}
