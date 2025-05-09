import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
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
    private rmqService: RmqService,
  ) { }

  /**
   * Creates a new order.
   * If an error occurs during the process, a BadRequestException is thrown.
   * @param createOrderDto Order data to be created
   * @returns The created order
   */
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const order = new this.orderModel(createOrderDto);
      return await order.save();
    } catch (error) {
      console.error('Error creating order:', error.message);
      throw new BadRequestException(
        'Error creating the order: ' + (error.message || 'Unknown error'),
      );
    }
  }

  /**
   * Retrieves all orders.
   * If an error occurs during the query, an InternalServerErrorException is thrown.
   * @returns An array of all orders in the database
   */
  async getOrders(): Promise<Order[]> {
    try {
      return await this.orderModel.find().exec();
    } catch (error) {
      console.error('Error retrieving orders:', error.message);
      throw new InternalServerErrorException(
        'Error retrieving orders: ' + (error.message || 'Unknown error'),
      );
    }
  }

  /**
   * Retrieves a specific order by its ID.
   * If the order is not found or if the ID is invalid, a NotFoundException or BadRequestException is thrown.
   * @param id The ID of the order to retrieve
   * @returns The order with the provided ID
   */
  async getOrder(id: string): Promise<Order> {
    try {
      const order = await this.orderModel.findById(id).exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      console.error(`Error retrieving order with ID ${id}:`, error.message);
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid order ID format');
      }
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  /**
   * Updates the status of an order.
   * If the order is not found or if the ID format is invalid, corresponding exceptions are thrown.
   * If the status is 'SHIPPED', an event is emitted via RabbitMQ.
   * @param id The ID of the order to update
   * @param status The new status of the order
   * @returns The updated order
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      const order = await this.orderModel.findById(id).exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      order.status = status;
      await order.save();

      // If the order status is 'SHIPPED', an event is emitted via RabbitMQ
      if (status === OrderStatus.SHIPPED) {
        this.rmqService.emitOrderShipped(order.orderId);
      }

      return order;
    } catch (error) {
      console.error(`Error updating status for order with ID ${id}:`, error.message);

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid order ID format');
      }

      throw new BadRequestException(
        'Error updating order status: ' + (error.message || 'Unknown error'),
      );
    }

  }
}
