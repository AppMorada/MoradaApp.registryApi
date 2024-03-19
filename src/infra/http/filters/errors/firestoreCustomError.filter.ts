import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { ReportAdapter } from '@app/adapters/reports';
import { FirestoreCustomError } from '@infra/storages/db/firestore/error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { fatalErrorHandler } from '@utils/fatalErrorHandler';
import { Request, Response } from 'express';

@Catch(FirestoreCustomError)
export class FirestoreCustomErrorFilter implements ExceptionFilter {
	constructor(
		private readonly logger: LoggerAdapter,
		private readonly report: ReportAdapter,
	) {}

	catch(exception: FirestoreCustomError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const request = context.getResponse<Request>();

		this.logger.error({
			name: `${exception.name} - ${exception.name}`,
			layer: LayersEnum.database,
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

		fatalErrorHandler();

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
