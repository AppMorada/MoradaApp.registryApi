import { LayersEnum, LoggerAdapter } from '@registry:app/adapters/logger';
import {
	ServiceErrors,
	ServiceErrorsTags,
} from '@registry:app/errors/services';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

interface IServiceErrors {
	name: string;
	tag: ServiceErrorsTags;
	message: string;
	httpCode: number;
}

@Catch(ServiceErrors)
export class ServiceErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	private possibleErrors: IServiceErrors[] = [
		{
			name: 'Credenciais inválidas',
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
	];

	catch(exception: ServiceErrors, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

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

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
