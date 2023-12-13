import { Echo } from 'echoguard';
import { ILoggerDefaultProps, LoggerAdapter, TECEProps } from '../logger';
import { warn, info, debug, error, log } from 'firebase-functions/logger';

export class FirebaseLoggerAdapter implements LoggerAdapter {
	async log(input: ILoggerDefaultProps): Promise<void> {
		log(`LOG: ${input.name}`, { ...input, level: Echo.LogsLevelEnum.info });
	}

	async info(input: ILoggerDefaultProps): Promise<void> {
		info(`INFO: ${input.name}`, {
			...input,
			level: Echo.LogsLevelEnum.info,
		});
	}

	async debug(input: ILoggerDefaultProps): Promise<void> {
		debug(`DEBUG: ${input.name}`, {
			...input,
			level: Echo.LogsLevelEnum.info,
		});
	}

	async warn(input: ILoggerDefaultProps): Promise<void> {
		warn(`WARN: ${input.name}`, {
			...input,
			level: Echo.LogsLevelEnum.info,
		});
	}

	async alert(input: ILoggerDefaultProps): Promise<void> {
		warn(`ALERT: ${input.name}`, {
			...input,
			level: Echo.LogsLevelEnum.info,
		});
	}

	async error({ stack, ...input }: TECEProps): Promise<void> {
		const description =
			process.env.LOGS !== 'SUPRESS_ONLY_STACK'
				? `${stack ? '\n[STACK] ' + stack : input.description}`
				: `${input.description}`;

		error(`ERROR: ${input.name}`, {
			...input,
			description,
			level: Echo.LogsLevelEnum.error,
		});
	}

	async critical({ stack, ...input }: TECEProps): Promise<void> {
		const description =
			process.env.LOGS !== 'SUPRESS_ONLY_STACK'
				? `${stack ? '\n[STACK] ' + stack : input.description}`
				: `${input.description}`;

		error(`CRITICAL: ${input.name}`, {
			...input,
			description,
			level: Echo.LogsLevelEnum.error,
		});
	}

	async emergencial({ stack, ...input }: TECEProps): Promise<void> {
		const description =
			process.env.LOGS !== 'SUPRESS_ONLY_STACK'
				? `${stack ? '\n[STACK] ' + stack : input.description}`
				: `${input.description}`;

		error(`EMERGENCIAL: ${input.name}`, {
			...input,
			description,
			level: Echo.LogsLevelEnum.error,
		});
	}
}
