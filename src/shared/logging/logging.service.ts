import { ConsoleLogger, Injectable, OnModuleInit } from '@nestjs/common';
import { access } from 'node:fs/promises';
import * as constants from 'node:constants';
import * as fs from 'fs/promises';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { LogLevel } from '../types';
import {
  LOG_FILE_SIZE_DEFAULT,
  MAX_LOG_FILE_AGE_DAYS,
  MS_IN_A_DAY,
} from '../constants/logging.constants';

dotenv.config();

@Injectable()
export class LoggingService extends ConsoleLogger implements OnModuleInit {
  private readonly logDirectory: string;
  private readonly logFilePath: string;
  private readonly maxFileSizeKB: number;

  constructor() {
    super(LoggingService.name);
    this.logDirectory = path.resolve(__dirname, '..', '..', '..', 'logs');
    this.logFilePath = path.join(this.logDirectory, 'app.log');
    this.maxFileSizeKB = parseInt(
      process.env.LOG_FILE_MAX_SIZE || LOG_FILE_SIZE_DEFAULT,
      10,
    );
  }

  async onModuleInit(): Promise<void> {
    await this.ensureLogDirectory();
  }

  async log(message: string): Promise<void> {
    super.log(message);
    await this.writeLog(LogLevel.INFO, message);
  }
  async error(message: string): Promise<void> {
    super.error(message);
    await this.writeLog(LogLevel.ERROR, `${message}`);
  }
  async warn(message: string): Promise<void> {
    super.warn(message);
    await this.writeLog(LogLevel.WARN, message);
  }

  private async ensureLogDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.logDirectory, { recursive: true });
      super.log('Create log directory: ' + this.logDirectory);
    } catch (error) {
      super.error('Failed to create log directory:', error.message);
    }
  }

  private async writeLog(level: string, message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;

    try {
      await this.rotateLogIfNeeded();
      await fs.appendFile(this.logFilePath, logMessage);
    } catch (error) {
      super.error('Failed to write log:', error.message);
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
    } catch (error) {
      super.error('Failed to rotate log file:', error.message);
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
        const diffInDays =
          (now.getTime() - fileModificationDate.getTime()) / MS_IN_A_DAY;

        if (diffInDays > MAX_LOG_FILE_AGE_DAYS) {
          await fs.unlink(filePath);
          super.log(`Deleted old log file: ${file}`);
        }
      }
    } catch (error) {
      super.error('Failed to remove old log files:', error.message);
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await access(filePath, constants.R_OK | constants.W_OK);
      return true;
    } catch {
      return false;
    }
  }
}
