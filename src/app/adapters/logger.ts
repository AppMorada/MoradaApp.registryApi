export enum LayersEnum {
	config = 'Config',
	healthCheck = 'Health-Check-layer',
	start = 'Start-layer',
	interceptors = 'Interceptor-Layer',
	services = 'Service-Layer',
	entitie = 'Entitie-Layer',
	controller = 'Controller-Layer',
	dto = 'DTO-Layer',
	auth = 'Auth-Layer',
	gateway = 'Gateway-Layer',
	unknown = 'Unknown-Layer',
	adapter = 'Adapter-Layer',
	database = 'Database-Layer',
	cache = 'Cache-Layer',
}

export interface ILoggerDefaultProps {
	name: string;
	description: string;
	layer: LayersEnum;
}

export type TErrProps = ILoggerDefaultProps & { stack?: string };

export abstract class LoggerAdapter {
	abstract log(input: ILoggerDefaultProps): Promise<void>;
	abstract info(input: ILoggerDefaultProps): Promise<void>;
	abstract debug(input: ILoggerDefaultProps): Promise<void>;
	abstract warn(input: ILoggerDefaultProps): Promise<void>;
	abstract error(input: TErrProps): Promise<void>;
	abstract fatal(input: TErrProps): Promise<void>;
}
