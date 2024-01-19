import { ILoggerDefaultProps, LoggerAdapter, TErrProps } from '../logger';
import { warn, info, debug, error, log } from 'firebase-functions/logger';

export class FirebaseLoggerAdapter implements LoggerAdapter {
	async log(input: ILoggerDefaultProps): Promise<void> {
		log(`LOG: ${input.name}`, { ...input, level: 'LOG' });
	}

	async info(input: ILoggerDefaultProps): Promise<void> {
		info(`INFO: ${input.name}`, {
			...input,
			level: 'INFO',
		});
	}

	async debug(input: ILoggerDefaultProps): Promise<void> {
		debug(`DEBUG: ${input.name}`, {
			...input,
			level: 'DEBUG',
		});
	}

	async warn(input: ILoggerDefaultProps): Promise<void> {
		warn(`WARN: ${input.name}`, {
			...input,
			level: 'WARN',
		});
	}

	async alert(input: ILoggerDefaultProps): Promise<void> {
		warn(`ALERT: ${input.name}`, {
			...input,
			level: 'ALERT',
		});
	}

	async error({ stack, ...input }: TErrProps): Promise<void> {
		const description =
			process.env.LOGS !== 'SUPRESS_ONLY_STACK'
				? `${stack ? '\n[STACK] ' + stack : input.description}`
				: `${input.description}`;

		error(`ERROR: ${input.name}`, {
			...input,
			description,
			level: 'ERROR',
		});
	}

	async critical({ stack, ...input }: TErrProps): Promise<void> {
		const description =
			process.env.LOGS !== 'SUPRESS_ONLY_STACK'
				? `${stack ? '\n[STACK] ' + stack : input.description}`
				: `${input.description}`;

		error(`CRITICAL: ${input.name}`, {
			...input,
			description,
			level: 'CRITICAL',
		});
	}

	async emergencial({ stack, ...input }: TErrProps): Promise<void> {
		const description =
			process.env.LOGS !== 'SUPRESS_ONLY_STACK'
				? `${stack ? '\n[STACK] ' + stack : input.description}`
				: `${input.description}`;

		error(`EMERGENCIAL: ${input.name}`, {
			...input,
			description,
			level: 'EMERGENCIAL',
		});
	}
}
