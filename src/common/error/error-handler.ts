import { LoggingService } from '../logging/logging.service';

export const registerGlobalErrorHandlers = (
  loggingService: LoggingService,
): void => {
  process.on('uncaughtException', (error) => {
    (async () => {
      try {
        await loggingService.error(
          JSON.stringify({
            message: 'Uncaught exception',
            exception: error,
          }),
        );
      } catch (loggingError) {
        console.error('Failed to log uncaught exception:', loggingError);
      }
    })();
  });

  process.on('unhandledRejection', (reason) => {
    (async () => {
      try {
        await loggingService.error(
          JSON.stringify({
            message: 'Unhandled promise rejection',
            exception: reason,
          }),
        );
      } catch (loggingError) {
        console.error(
          'Failed to log unhandled promise rejection:',
          loggingError,
        );
      }
    })();
  });
};
