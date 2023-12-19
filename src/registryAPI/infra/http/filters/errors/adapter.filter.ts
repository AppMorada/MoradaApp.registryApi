import { LayersEnum, LoggerAdapter } from '@registry:app/adapters/logger';
import { AdapterError } from '@registry:app/errors/adapter';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(AdapterError)
export class AdapterErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	catch(exception: AdapterError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		this.logger.error({
			name: exception.name,
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
