import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { ReportAdapter } from '@app/adapters/reports';
import { GatewayErrors, GatewaysErrorsTags } from '@infra/gateways/errors';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

interface IGatewayError {
	name: string;
	tag: GatewaysErrorsTags;
	message: string;
	httpCode: number;
}

@Catch(GatewayErrors)
export class GatewayErrorFilter implements ExceptionFilter {
	constructor(
		private readonly logger: LoggerAdapter,
		private readonly report: ReportAdapter,
	) {}

	private possibleErrors: IGatewayError[] = [
		{
			name: 'Entrada inválida',
			tag: GatewaysErrorsTags.InvalidResult,
			message:
				'Não foi possível atingir o resultado esperado com a entrada de dados fornecida, por favor, verifique se seus dados são válidos',
			httpCode: 400,
		},
		{
			name: 'Dado envenenado',
			tag: GatewaysErrorsTags.PoisonedContent,
			message: 'Conteúdo mau formado pelo servidor',
			httpCode: 500,
		},
	];

	catch(exception: GatewayErrors, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const request = context.getResponse<Request>();

		const error = this.possibleErrors.find((item) => {
			return item.tag === exception.tag;
		});

		if (error) {
			this.logger.error({
				name: `${error.name} - ${exception.name}`,
				layer: LayersEnum.gateway,
				description: `${
					exception.content
						? `${error.message} - ${exception.content}`
						: error.message
				}`,
				stack: exception.stack,
			});

			return response.status(error.httpCode).json({
				statusCode: error.httpCode,
				message: error.message,
			});
		}

		this.logger.error({
			name: exception.name,
			layer: LayersEnum.gateway,
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
