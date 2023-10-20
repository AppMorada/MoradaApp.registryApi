import {
	RedisErrorsTags,
	RedisLogicError,
} from '@infra/storages/cache/errors/redis';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

interface IRedisError {
	tag: RedisErrorsTags;
	message: string;
	httpCode: number;
}

@Catch(RedisLogicError)
export class RedisErrorFilter implements ExceptionFilter {
	private possibleErrors: IRedisError[] = [
		{
			tag: RedisErrorsTags.alreadyExist,
			message: 'Could not launch invite, because it already exists',
			httpCode: 409,
		},
	];

	catch(exception: RedisLogicError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		const error = this.possibleErrors.find((item) => {
			return item.tag === exception.tag;
		});

		if (error)
			return response.status(error.httpCode).json({
				statusCode: error.httpCode,
				message: error.message,
			});

		return response.status(500).json({
			statusCode: 500,
			message: 'Internal Server Error',
		});
	}
}
