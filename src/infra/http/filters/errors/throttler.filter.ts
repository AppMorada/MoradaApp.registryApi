import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response, Request } from 'express';

/** Usado para filtrar erros dos Throttler */
@Catch(ThrottlerException)
export class ThrottlerErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	catch(exception: ThrottlerException, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const request = context.getRequest<Request>();

		this.logger.error({
			name: `SessionId(${request.sessionId}): Muitas requisições`,
			layer: LayersEnum.auth,
			description: 'Muitas requisições realizadas',
			stack: exception.stack,
		});

		return response.status(429).json({
			statusCode: 429,
			name: 'Muitas requisições',
			message: 'Muitas requisições realizadas',
		});
	}
}
