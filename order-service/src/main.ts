import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const PORT = configService.get('PORT');
  
  if (!PORT) {
    throw new Error('The PORT environment variable is not defined or is incorrect.');
  }

  // Try to start the application and handle any errors that may occur
  try {
    await app.listen(PORT);
    console.log(`Application is running on: http://localhost:${PORT}`);
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1); 
  }
}

bootstrap();
