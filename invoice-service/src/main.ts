import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get<string>('PORT');
  const RABBITMQ_URI = configService.get<string>('RABBITMQ_URI');
  const RABBITMQ_QUEUE = configService.get<string>('RABBITMQ_QUEUE');

  if (!PORT || !RABBITMQ_URI || !RABBITMQ_QUEUE) {
    throw new Error('Missing environment variables: PORT, RABBITMQ_URI, or RABBITMQ_QUEUE');
  }

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URI],
      queue: RABBITMQ_QUEUE,
      queueOptions: { durable: false },
    },
  });

  try {
    await app.startAllMicroservices(); // Inicia el microservicio para escuchar eventos
    console.log(`✅ Microservice is listening for RabbitMQ events on queue: ${RABBITMQ_QUEUE}`);
    await app.listen(PORT);
    console.log(`🚀 Application is running on: http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Error starting the application:', error);
    process.exit(1);
  }
}

bootstrap();
