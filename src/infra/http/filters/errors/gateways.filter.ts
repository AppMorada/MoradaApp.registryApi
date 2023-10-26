import { GatewayErrors, GatewaysErrorsTags } from '@infra/http/gateways/errors';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { LayersEnum, Log } from '@utils/log';
import { Response } from 'express';

interface IGatewayError {
	name: string;
	tag: GatewaysErrorsTags;
	message: string;
	httpCode: number;
}

@Catch(GatewayErrors)
export class GatewayErrorFilter implements ExceptionFilter {
	private possibleErrors: IGatewayError[] = [
		{
			name: 'Entrada inválida',
			tag: GatewaysErrorsTags.InvalidResult,
			message:
				'Não foi possível atingir o resultado esperado com a entrada de dados fornecida, por favor, verifique se seus dados são válidos',
			httpCode: 400,
		},
	];

	catch(exception: GatewayErrors, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		const error = this.possibleErrors.find((item) => {
			return item.tag === exception.tag;
		});

		if (error) {
			Log.error({
				name: `${error.name} - ${exception.name}`,
				layer: LayersEnum.gateway,
				message: error.message,
				stack: exception.stack,
				httpCode: error.httpCode,
			});

			return response.status(error.httpCode).json({
				statusCode: error.httpCode,
				message: error.message,
			});
		}

		Log.error({
			name: exception.name,
			layer: LayersEnum.gateway,
			message: exception.message,
			stack: exception.stack,
			httpCode: 500,
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
