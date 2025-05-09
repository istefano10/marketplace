import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
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
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
