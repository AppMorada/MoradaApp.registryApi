import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { AdapterError } from '@app/errors/adapter';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

/** Usado para filtrar erros dos Adapters */
@Catch(AdapterError)
export class AdapterErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	catch(exception: AdapterError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const request = context.getRequest<Request>();

		this.logger.error({
			name: `SessionId(${request.sessionId}): ${exception.name}`,
			layer: LayersEnum.adapter,
			description: exception.message,
			stack: exception.stack,
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
