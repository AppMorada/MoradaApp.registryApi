import { LayersEnum, LoggerAdapter } from '@registry:app/adapters/logger';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

/** Usado para filtrar erros dos Throttler */
@Catch(ThrottlerException)
export class ThrottlerErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	catch(exception: ThrottlerException, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		this.logger.error({
			name: 'Muitas requisições',
			layer: LayersEnum.auth,
			description: 'Muitas requisições realizadas',
			stack: exception.stack,
		});

		return response.status(400).json({
			statusCode: 400,
			name: 'Muitas requisições',
			message: 'Muitas requisições realizadas',
		});
	}
}
