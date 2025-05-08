import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { OrderShippedListener } from './listeners/order-shipped.listener';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
    ]),

    // ClientsModule for asynchronous RabbitMQ configuration
    ClientsModule.registerAsync([
      {
        name: 'ORDER_RMQ_SERVICE',  // Ensure the service name here matches the emitting service
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') !],
            queue: configService.get<string>('RABBITMQ_QUEUE')!,
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, OrderShippedListener],  // Listeners and services
})
export class InvoiceModule {}
