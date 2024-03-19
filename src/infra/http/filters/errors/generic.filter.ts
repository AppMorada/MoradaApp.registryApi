import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { ReportAdapter } from '@app/adapters/reports';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

interface IUntrackableErrors {
	name: string;
	key: string;
	message: string;
	httpCode: number;
}

@Catch()
export class GenericErrorFilter implements ExceptionFilter {
	constructor(
		private readonly logger: LoggerAdapter,
		private readonly report: ReportAdapter,
	) {}

	private readonly untrackableErrors: IUntrackableErrors[] = [
		{
			name: 'Conteúdo já existe',
			key: 'ALREADY_EXISTS: entity already exists',
			message: 'O conteúdo a ser criado já existe',
			httpCode: 401,
		},
	];

	catch(exception: Error, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const request = context.getResponse<Request>();

		const error = this.untrackableErrors.find((item) => {
			return exception?.message?.includes(item.key);
		});

		if (error) {
			this.logger.error({
				name: `${error.name} - ${exception.name}`,
				layer: LayersEnum.database,
				description: error.message,
				stack: exception.stack,
			});

			return response.status(error.httpCode).json({
				statusCode: error.httpCode,
				message: error.message,
			});
		}

		this.logger.error({
			name: `Erro interno do servidor ${exception?.name}`,
			layer: LayersEnum.unknown,
			description: exception?.message ?? 'Causa desconhecida',
			stack: exception?.stack ?? 'Causa desconhecida',
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
