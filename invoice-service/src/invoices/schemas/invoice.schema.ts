// invoice.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ required: true })
  invoiceId: string;

  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  pdfUrl: string;

  @Prop()
  sentAt?: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
