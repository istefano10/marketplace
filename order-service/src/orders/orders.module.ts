import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersController } from './controller/orders.controller';
import { OrdersService } from './service/orders.service';
import { RmqService } from './rmq/rmq.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { ValidateOrderStatusMiddleware } from './midlewares/validate-order-status.middleware';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ClientsModule.registerAsync([
      {
        name: 'ORDER_RMQ_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')!],
            queue: configService.get<string>('RABBITMQ_QUEUE'),
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, RmqService],
})
export class OrdersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicar el middleware a la ruta de actualización de estado
    consumer.apply(ValidateOrderStatusMiddleware).forRoutes('orders/:id/status');
  }
}
