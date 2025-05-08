import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get('PORT');
  if (!PORT) {
    throw new Error('Missing PORT environment variable');
  }

  await app.listen(PORT);
  console.log(`🚀 Application is running on: http://localhost:${PORT}`);
}

bootstrap();
