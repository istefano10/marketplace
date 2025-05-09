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

@Schema({ collection: 'orders' }) // asegura que busque la colección correcta
export class Order {
  @Prop({ required: true })
  orderId: string;

  @Prop()
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
