import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // Global configuration setup
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Mongoose configuration for MongoDB
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('MONGO_URI'), // Retrieve Mongo URI from config
        };
      },
      inject: [ConfigService], // Inject ConfigService to make use of environment variables
    }),

    // Import the OrdersModule
    OrdersModule,
  ],
})
export class AppModule {}
