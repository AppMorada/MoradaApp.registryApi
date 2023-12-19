import { Echo } from 'echoguard';
import { ILoggerDefaultProps, LoggerAdapter, TECEProps } from '../logger';

export class EchoguardAdapter implements LoggerAdapter {
	async log(input: ILoggerDefaultProps): Promise<void> {
		Echo.create({ ...input, level: Echo.LogsLevelEnum.info });
	}

	async info(input: ILoggerDefaultProps): Promise<void> {
		Echo.create({ ...input, level: Echo.LogsLevelEnum.info });
	}

	async debug(input: ILoggerDefaultProps): Promise<void> {
		Echo.create({ ...input, level: Echo.LogsLevelEnum.debug });
	}

	async warn(input: ILoggerDefaultProps): Promise<void> {
		Echo.create({ ...input, level: Echo.LogsLevelEnum.warn });
	}

	async alert(input: ILoggerDefaultProps): Promise<void> {
		Echo.create({ ...input, level: Echo.LogsLevelEnum.alert });
	}

	async error({ stack, ...input }: TECEProps): Promise<void> {
		const description =
			process.env.LOGS !== 'SUPRESS_ONLY_STACK'
				? `${stack ? '\n[STACK] ' + stack : input.description}`
				: `${input.description}`;

		Echo.create({
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

		Echo.create({
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

		Echo.create({
			...input,
			description,
			level: Echo.LogsLevelEnum.error,
		});
	}
}
