import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { RmqService } from './rmq/rmq.service'; // Service for emitting events using RabbitMQ
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    // MongoDB setup for orders
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),

    // Load configuration globally
    ConfigModule,

    // Register RabbitMQ Client asynchronously
    ClientsModule.registerAsync([
      {
        name: 'ORDER_RMQ_SERVICE', // Name for the RabbitMQ client (for sending/receiving events)
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')!], // Get RabbitMQ URI from environment
            queue: configService.get<string>('RABBITMQ_QUEUE')!, // Get queue name from environment
            queueOptions: { durable: false }, // Queue options
          },
        }),
        inject: [ConfigService], // Inject ConfigService to access environment variables
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    RmqService, // This is the service that uses the RabbitMQ client to emit messages
  ],
})
export class OrdersModule {}
