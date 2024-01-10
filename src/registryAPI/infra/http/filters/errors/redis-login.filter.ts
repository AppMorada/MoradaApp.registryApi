import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { LayersEnum, LoggerAdapter } from '@registry:app/adapters/logger';
import {
	RedisErrorsTags,
	RedisLogicError,
} from '@registry:infra/storages/cache/redis/error';
import { Response } from 'express';

interface IRedisError {
	name: string;
	tag: RedisErrorsTags;
	message: string;
	httpCode: number;
}

@Catch(RedisLogicError)
export class RedisErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	private possibleErrors: IRedisError[] = [
		{
			name: 'Dado já existe',
			tag: RedisErrorsTags.alreadyExist,
			message: 'Não foi possível criar o dado, pois o mesmo já existe',
			httpCode: 409,
		},
	];

	catch(exception: RedisLogicError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		const error = this.possibleErrors.find((item) => {
			return item.tag === exception.tag;
		});

		if (error) {
			this.logger.error({
				name: `${error.name} - ${exception.name}`,
				layer: LayersEnum.cache,
				description: error.message,
				stack: exception.stack,
			});
			return response.status(error.httpCode).json({
				statusCode: error.httpCode,
				message: error.message,
			});
		}

		this.logger.error({
			name: exception.name,
			layer: LayersEnum.cache,
			description: exception.message,
			stack: exception.stack,
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
