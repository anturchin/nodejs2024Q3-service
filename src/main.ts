import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { LoggingService } from './shared/logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const databaseService = app.get(DatabaseService);
  const loggingService = app.get(LoggingService);
  await databaseService.enableShutdownHooks(app);

  process.on('uncaughtException', (error) => {
    loggingService.error(
      JSON.stringify({
        message: 'Uncaught exception',
        exception: error,
      }),
    );
  });

  process.on('unhandledRejection', (reason) => {
    loggingService.error(
      JSON.stringify({
        message: 'Unhandled promise rejection',
        exception: reason,
      }),
    );
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  await app.listen(port);
}

bootstrap();
