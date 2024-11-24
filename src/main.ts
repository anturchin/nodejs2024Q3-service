import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { LoggingService } from './shared/logging/logging.service';
import { registerGlobalErrorHandlers } from './shared/error/error-handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggingService(),
  });

  app.useGlobalPipes(new ValidationPipe());

  const databaseService = app.get(DatabaseService);
  const loggingService = app.get(LoggingService);
  await databaseService.enableShutdownHooks(app);

  registerGlobalErrorHandlers(loggingService);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  await app.listen(port);
}

bootstrap();
