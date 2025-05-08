import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  CREATED = 'CREATED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  SHIPPING_IN_PROGRESS = 'SHIPPING_IN_PROGRESS',
  SHIPPED = 'SHIPPED',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  sellerId: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true, enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
