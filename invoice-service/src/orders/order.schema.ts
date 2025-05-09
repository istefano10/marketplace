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

@Schema({ collection: 'orders' })
export class Order {
  @Prop({ required: true })
  orderId: string;

  @Prop({  enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
