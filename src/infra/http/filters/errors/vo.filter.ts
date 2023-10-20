import { EntitiesEnum } from '@app/entities/entities';
import { EntitieError } from '@app/errors/entities';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(EntitieError)
export class EntitieErrorFilter implements ExceptionFilter {
	catch(exception: EntitieError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		if (exception.entity === EntitiesEnum.vo)
			return response.status(400).json({
				statusCode: 400,
				message: 'Bad Request - Internal Malformed Entity',
			});

		return response.status(500).json({
			statusCode: 500,
			message: 'Internal Server Error',
		});
	}
}
