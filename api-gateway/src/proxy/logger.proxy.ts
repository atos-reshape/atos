import { Logger } from '@nestjs/common';

const logger = new Logger('ProxyMiddleware');
const useLogger = () => ({
  info: (...args: any[]) => logger.log(args),
  debug: (...args: any[]) => logger.log(args),
  error: (...args: any[]) => logger.log(args),
  warn: (...args: any[]) => logger.log(args),
  log: (...args: any[]) => logger.log(args),
});

export { useLogger };
