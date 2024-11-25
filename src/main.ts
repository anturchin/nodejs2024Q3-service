import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { LoggingService } from './common/logging/logging.service';
import { registerGlobalErrorHandlers } from './common/error/error-handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const loggingService = app.get(LoggingService);
  app.useLogger(loggingService);
  app.useGlobalPipes(new ValidationPipe());

  const databaseService = app.get(DatabaseService);
  await databaseService.enableShutdownHooks(app);

  registerGlobalErrorHandlers(loggingService);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  await app.listen(port);
}

bootstrap();
