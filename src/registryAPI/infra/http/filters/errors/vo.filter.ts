import { LayersEnum, LoggerAdapter } from '@registry:app/adapters/logger';
import { EntitiesEnum } from '@registry:app/entities/entities';
import { EntitieError } from '@registry:app/errors/entities';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

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
				message:
					'Valores malformados foram detectados, certifique-se de que o conteúdo possui uma boa integridade',
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
