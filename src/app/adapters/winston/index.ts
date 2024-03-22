import { Injectable } from '@nestjs/common';
import { ILoggerDefaultProps, LoggerAdapter, TErrProps } from '../logger';
import * as winston from 'winston';

@Injectable()
export class WinstonLoggerAdapter implements LoggerAdapter {
	private readonly logger: winston.Logger;

	constructor() {
		this.logger = winston.createLogger({
			levels: {
				emergency: 0,
				error: 1,
				warn: 2,
				info: 3,
				debug: 4,
				log: 5,
			},
			format: winston.format.printf((info) => {
				return `${JSON.stringify({
					timestamp: info.timestamp,
					severity: info.level.toUpperCase(),
					data: info.message,
				})}`;
			}),
			transports: [new winston.transports.Console()],
		});
	}

	async log(input: ILoggerDefaultProps) {
		this.logger.log('log', input);
	}

	async info(input: ILoggerDefaultProps) {
		this.logger.info(input);
	}

	async warn(input: ILoggerDefaultProps) {
		this.logger.warn(input);
	}

	async debug(input: ILoggerDefaultProps) {
		this.logger.debug(input);
	}

	async error(input: ILoggerDefaultProps) {
		this.logger.error(input);
	}

	async fatal(input: TErrProps): Promise<void> {
		this.logger.log('emergency', { message: input });
	}
}
