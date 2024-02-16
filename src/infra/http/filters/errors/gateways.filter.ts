import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { GatewayErrors, GatewaysErrorsTags } from '@infra/gateways/errors';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response, Request } from 'express';

interface IGatewayError {
	name: string;
	tag: GatewaysErrorsTags;
	message: string;
	httpCode: number;
}

/** Usado para filtrar erros dos Gateways */
@Catch(GatewayErrors)
export class GatewayErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

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
		const request = context.getRequest<Request>();

		const error = this.possibleErrors.find((item) => {
			return item.tag === exception.tag;
		});

		if (error) {
			this.logger.error({
				name: `SessionId(${request.sessionId}): ${error.name} - ${exception.name}`,
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
			name: `SessionId(${request.sessionId}): ${exception.name}`,
			layer: LayersEnum.gateway,
			description: exception.message,
			stack: exception.stack,
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
