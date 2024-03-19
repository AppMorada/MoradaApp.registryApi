import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { ReportAdapter } from '@app/adapters/reports';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

interface IServiceErrors {
	name: string;
	tag: ServiceErrorsTags;
	message: string;
	httpCode: number;
}

@Catch(ServiceErrors)
export class ServiceErrorFilter implements ExceptionFilter {
	constructor(
		private readonly logger: LoggerAdapter,
		private readonly report: ReportAdapter,
	) {}

	private possibleErrors: IServiceErrors[] = [
		{
			name: 'Ação não autorizada',
			tag: ServiceErrorsTags.unauthorized,
			message: 'Acesso não autorizado',
			httpCode: 401,
		},
		{
			name: 'Dado já existe',
			tag: ServiceErrorsTags.alreadyExist,
			message: 'O conteúdo a ser criado já existe',
			httpCode: 409,
		},
		{
			name: 'Uso incorreto de recusrsos',
			tag: ServiceErrorsTags.wrongServiceUsage,
			message:
				'Não é possível utilizar este recurso para realizar está ação',
			httpCode: 400,
		},
	];

	catch(exception: ServiceErrors, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const request = context.getRequest<Request>();

		const error = this.possibleErrors.find((item) => {
			return item.tag === exception.tag;
		});

		if (error) {
			this.logger.error({
				name: `${error.name} - ${exception.name}`,
				layer: LayersEnum.services,
				description: error.message,
				stack: exception.stack,
			});

			return response.status(error.httpCode).json({
				statusCode: error.httpCode,
				message: error.message,
			});
		}

		this.logger.error({
			name: exception.name,
			layer: LayersEnum.services,
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
