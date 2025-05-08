import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Order, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { RmqService } from './rmq/rmq.service';
export declare class OrdersService {
    private orderModel;
    private client;
    private rmqService;
    constructor(orderModel: Model<Order>, client: ClientProxy, rmqService: RmqService);
    createOrder(createOrderDto: CreateOrderDto): Promise<Order>;
    getOrders(): Promise<Order[]>;
    getOrder(id: string): Promise<Order>;
    updateOrderStatus(id: string, status: OrderStatus): Promise<Order>;
}
