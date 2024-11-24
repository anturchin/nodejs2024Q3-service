import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { LogLevel } from '../types';
import {
  LOG_FILE_MAX_SIZE,
  LOG_FILE_SIZE_DEFAULT,
} from '../constants/logging.constants';

@Injectable()
export class LoggingService implements OnModuleInit {
  private readonly logger: Logger = new Logger(LoggingService.name);
  private readonly logDirectory: string = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'logs',
  );
  private readonly logFilePath: string;
  private readonly maxFileSizeKB: number;

  constructor(private readonly configService: ConfigService) {
    this.logFilePath = path.join(this.logDirectory, 'app.log');
    this.maxFileSizeKB = parseInt(
      this.configService.get<string>(LOG_FILE_MAX_SIZE) ||
        LOG_FILE_SIZE_DEFAULT,
      10,
    );
  }

  async onModuleInit(): Promise<void> {
    await this.ensureLogDirectory();
  }

  async log(message: string): Promise<void> {
    this.logger.log(message);
    await this.writeLog(LogLevel.INFO, message);
  }
  async error(message: string): Promise<void> {
    this.logger.error(message);
    await this.writeLog(LogLevel.ERROR, `${message}`);
  }
  async warn(message: string): Promise<void> {
    this.logger.warn(message);
    await this.writeLog(LogLevel.WARN, message);
  }

  private async ensureLogDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.logDirectory, { recursive: true });
      this.logger.log('Create log directory: ' + this.logDirectory);
    } catch (err) {
      this.logger.error('Failed to create log directory:', err.message);
    }
  }

  private async writeLog(level: string, message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;

    try {
      await this.rotateLogIfNeeded();
      await fs.appendFile(this.logFilePath, logMessage);
    } catch (err) {
      this.logger.error('Failed to write log:', err.message);
    }
  }

  private async rotateLogIfNeeded(): Promise<void> {
    try {
      const fileExists = await this.fileExists(this.logFilePath);

      if (fileExists) {
        const stats = await fs.stat(this.logFilePath);
        const fileSizeInKB = stats.size / 1024;

        if (fileSizeInKB >= this.maxFileSizeKB) {
          const rotatedFileName = `app-${Date.now()}.log`;
          const rotatedFilePath = path.join(this.logDirectory, rotatedFileName);
          await fs.rename(this.logFilePath, rotatedFilePath);
        }
      }

      await this.removeOldLogFiles();
    } catch (err) {
      this.logger.error('Failed to rotate log file:', err.message);
    }
  }

  private async removeOldLogFiles(): Promise<void> {
    try {
      const files = await fs.readdir(this.logDirectory);
      const now = new Date();
      for (const file of files) {
        const filePath = path.join(this.logDirectory, file);
        const stats = await fs.stat(filePath);

        const fileModificationDate = stats.mtime;
        const diffInMS = now.getTime() - fileModificationDate.getTime();
        const diffInDays = diffInMS / (1000 * 3600 * 24);

        if (diffInDays > 1) {
          await fs.unlink(filePath);
          this.logger.log(`Deleted old log file: ${file}`);
        }
      }
    } catch (err) {
      this.logger.error('Failed to remove old log files:', err.message);
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
