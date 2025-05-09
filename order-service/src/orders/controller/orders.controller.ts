import { Controller, Post, Get, Param, Patch, Body, HttpException, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderStatus } from '../schemas/order.schema';
import { Types } from 'mongoose';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      return await this.ordersService.createOrder(createOrderDto);
    } catch (error) {
      console.error('Error creating order:', error.message);
      throw new HttpException(
        error.message || 'Internal server error while creating order',
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  @Get()
  async getOrders() {
    try {
      return await this.ordersService.getOrders();
    } catch (error) {
      console.error('Error getting orders:', error.message);
      throw new HttpException(
        error.message || 'Internal server error while fetching orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID format');
    }

    try {
      return await this.ordersService.getOrder(id);
    } catch (error) {
      console.error(`Error getting order with id ${id}:`, error.message);
      throw new NotFoundException(`Order with id ${id} not found`);
    }
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() status: { status: OrderStatus },
  ) {
    try {
      return await this.ordersService.updateOrderStatus(id, status.status);
    } catch (error) {
      console.error(`Error updating status for order with id ${id}:`, error.message);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Order with id ${id} not found`);
      } else {
        throw new BadRequestException('Error updating order status');
      }
    }
  }

}
