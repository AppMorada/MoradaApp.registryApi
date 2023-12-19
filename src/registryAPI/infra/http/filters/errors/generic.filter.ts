import { LayersEnum, LoggerAdapter } from '@registry:app/adapters/logger';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GenericErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	catch(exception: Error, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		this.logger.error({
			name: exception.name,
			layer: LayersEnum.unknown,
			description: exception.message,
			stack: exception.stack,
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
