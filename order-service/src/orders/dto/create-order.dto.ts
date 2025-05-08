import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  productId: string;

  @IsString()
  customerId: string;

  @IsString()
  sellerId: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
