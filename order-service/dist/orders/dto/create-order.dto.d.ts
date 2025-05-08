import { OrderStatus } from '../schemas/order.schema';
export declare class CreateOrderDto {
    orderId: string;
    productId: string;
    customerId: string;
    sellerId: string;
    price: number;
    quantity: number;
    status: OrderStatus;
}
