import { Injectable } from '@nestjs/common';
import { ILoggerDefaultProps, LoggerAdapter, TErrProps } from '../logger';
import pino from 'pino';
import pretty from 'pino-pretty';

@Injectable()
export class PinoLoggerAdapter implements LoggerAdapter {
	private readonly logger: ReturnType<typeof pino>;

	constructor() {
		this.logger =
			process.env.LOG_TYPE !== 'sync'
				? pino({ transport: { target: 'pino-pretty' } })
				: pino(pretty({ sync: true }));
	}

	async log(input: ILoggerDefaultProps) {
		this.logger.log(JSON.stringify(input));
	}

	async info(input: ILoggerDefaultProps) {
		this.logger.info(JSON.stringify(input));
	}

	async warn(input: ILoggerDefaultProps) {
		this.logger.warn(JSON.stringify(input));
	}

	async debug(input: ILoggerDefaultProps) {
		this.logger.debug(JSON.stringify(input));
	}

	async error(input: ILoggerDefaultProps) {
		this.logger.error(JSON.stringify(input));
	}

	async fatal(input: TErrProps): Promise<void> {
		this.logger.fatal(JSON.stringify(input));
	}
}
