import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { HealthCheckError } from '@nestjs/terminus';
import { ReportAdapter } from '@app/adapters/reports';

@Catch(HealthCheckError)
export class HealthCheckErrorFilter implements ExceptionFilter {
	constructor(private readonly report: ReportAdapter) {}

	catch(exception: HealthCheckError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const request = context.getResponse<Request>();

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
