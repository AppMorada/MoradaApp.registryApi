import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { ReportAdapter } from '@app/adapters/reports';
import { EntitiesEnum } from '@app/entities/entities';
import { EntitieError } from '@app/errors/entities';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(EntitieError)
export class EntitieErrorFilter implements ExceptionFilter {
	constructor(
		private readonly logger: LoggerAdapter,
		private readonly report: ReportAdapter,
	) {}

	catch(exception: EntitieError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const request = context.getRequest<Request>();

		if (exception.entity === EntitiesEnum.vo) {
			this.logger.error({
				name: exception.name,
				layer: LayersEnum.entitie,
				description: exception.message,
				stack: exception.stack,
			});

			return response.status(400).json({
				statusCode: 400,
				message: [exception.message],
			});
		}

		this.logger.error({
			name: exception.name,
			layer: LayersEnum.entitie,
			description: exception.message,
			stack: exception.stack,
		});
		this.report.error({
			err: exception,
			statusCode: 500,
			url: request.url,
			method: request.method,
			userAgent: request.headers?.['user-agent'],
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
