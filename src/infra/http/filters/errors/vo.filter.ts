import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { EntitiesEnum } from '@app/entities/entities';
import { EntitieError } from '@app/errors/entities';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

/** Usado para filtrar erros dos Value Objects */
@Catch(EntitieError)
export class EntitieErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	catch(exception: EntitieError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

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

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
