import { injectable } from 'inversify';
import { createLogger, format, transports, Logger } from 'winston';

@injectable()
export class LoggerService {
    private logger: Logger;

    constructor() {
        this.logger = createLogger({
            format: format.combine(
                format.timestamp(),
                format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
                format.json()
            ),
            transports: [new transports.Console(), new transports.File({ filename: 'combined.log' }), new transports.File({ filename: 'error.log', level: 'error' })],
        });
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public warn(message: string): void {
        this.logger.warn(message);
    }

    public error(message: string, error?: Error): void {
        if (error) {
            this.logger.error(`${message} - ${error.message}`);
        } else {
            this.logger.error(message);
        }
    }
}