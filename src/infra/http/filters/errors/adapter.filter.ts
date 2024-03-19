import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { ReportAdapter } from '@app/adapters/reports';
import { AdapterError } from '@app/errors/adapter';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(AdapterError)
export class AdapterErrorFilter implements ExceptionFilter {
	constructor(
		private readonly logger: LoggerAdapter,
		private readonly report: ReportAdapter,
	) {}

	catch(exception: AdapterError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const request = context.getRequest<Request>();

		this.logger.error({
			name: exception.name,
			layer: LayersEnum.adapter,
			description: exception.message,
			stack: exception.stack,
		});
		this.report.error({
			err: exception,
			statusCode: 500,
			url: request.url,
			method: request.method,
			userAgent: request.headers['user-agent'],
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
