import { Service } from 'typedi';
import winston from 'winston';

@Service()
export class LogService {
  private logger = winston.createLogger({
    format: winston.format.printf(
      (info) =>
        `[${info.level.toUpperCase()}] [${new Date().toLocaleString()}] ${JSON.stringify(
          info
        )}`
    ),
    transports: [
      new winston.transports.File({
        filename: `${process.cwd()}/application.log`,
      }),
      new winston.transports.Console(),
    ],
  });

  info(message: string, meta?: any) {
    return this.logger.info(message, meta);
  }

  error(message: string, meta?: any) {
    return this.logger.error(message, meta);
  }
}
