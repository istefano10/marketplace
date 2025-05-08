// orders.controller.ts
import { Controller, Post, Get, Param, Patch, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './schemas/order.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  async getOrders() {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() statusDto: { status: OrderStatus },
  ) {
    return this.ordersService.updateOrderStatus(id, statusDto.status);
  }
}
