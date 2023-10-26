import {
	RedisErrorsTags,
	RedisLogicError,
} from '@infra/storages/cache/errors/redis';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { LayersEnum, Log } from '@utils/log';
import { Response } from 'express';

interface IRedisError {
	name: string;
	tag: RedisErrorsTags;
	message: string;
	httpCode: number;
}

@Catch(RedisLogicError)
export class RedisErrorFilter implements ExceptionFilter {
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
			Log.error({
				name: `${error.name} - ${exception.name}`,
				layer: LayersEnum.cache,
				message: error.message,
				httpCode: error.httpCode,
				stack: exception.stack,
			});
			return response.status(error.httpCode).json({
				statusCode: error.httpCode,
				message: error.message,
			});
		}

		Log.error({
			name: exception.name,
			layer: LayersEnum.cache,
			message: exception.message,
			httpCode: 500,
			stack: exception.stack,
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
