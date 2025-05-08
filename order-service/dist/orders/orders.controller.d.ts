import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './schemas/order.schema';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(createOrderDto: CreateOrderDto): Promise<import("./schemas/order.schema").Order>;
    getOrders(): Promise<import("./schemas/order.schema").Order[]>;
    getOrder(id: string): Promise<import("./schemas/order.schema").Order>;
    updateOrderStatus(id: string, statusDto: {
        status: OrderStatus;
    }): Promise<import("./schemas/order.schema").Order>;
}
