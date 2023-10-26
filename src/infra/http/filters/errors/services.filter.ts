import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { LayersEnum, Log } from '@utils/log';
import { Response } from 'express';

interface IServiceErrors {
	name: string;
	tag: ServiceErrorsTags;
	message: string;
	httpCode: number;
}

@Catch(ServiceErrors)
export class ServiceErrorFilter implements ExceptionFilter {
	private possibleErrors: IServiceErrors[] = [
		{
			name: 'Credenciais inválidas',
			tag: ServiceErrorsTags.unauthorized,
			message: 'Acesso não autorizado',
			httpCode: 401,
		},
	];

	catch(exception: ServiceErrors, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		const error = this.possibleErrors.find((item) => {
			return item.tag === exception.tag;
		});

		if (error) {
			Log.error({
				name: `${error.name} - ${exception.name}`,
				layer: LayersEnum.services,
				message: error.message,
				tag: error.tag,
				httpCode: error.httpCode,
				stack: exception.stack,
			});

			return response.status(error.httpCode).json({
				statusCode: error.httpCode,
				message: error.message,
			});
		}

		Log.error({
			name: exception.name,
			layer: LayersEnum.services,
			message: exception.message,
			tag: exception.tag,
			httpCode: 500,
			stack: exception.stack,
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
