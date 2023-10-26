import { logger } from 'src/configs/logger';

export enum LayersEnum {
	services = 'Service-Layer',
	entitie = 'Entitie-Layer',
	dto = 'DTO-Layer',
	auth = 'Auth-Layer',
	gateway = 'Gateway-Layer',
	unknown = 'Unknown-Layer',
	adapter = 'Adapter-Layer',
	database = 'Database-Layer',
	cache = 'Cache-Layer',
}

interface IErrorProps {
	name: string;
	message: string | string[];
	layer: LayersEnum;
	httpCode?: number;
	stack?: string;
	tag?: string;
}

export class Log {
	static error({ stack, ...input }: IErrorProps) {
		if (process.env.DISABLE_LOGS !== 'SUPRESS')
			logger.error({
				...input,
				stack:
					process.env.LOGS === 'SUPRESS_ONLY_STACK'
						? undefined
						: stack,
			});
	}
}
