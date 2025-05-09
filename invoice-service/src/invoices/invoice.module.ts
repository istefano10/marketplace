import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { OrderService } from 'src/orders/orders.service';
import { Order, OrderSchema } from 'src/orders/order.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, OrderService],
})
export class InvoiceModule {}
