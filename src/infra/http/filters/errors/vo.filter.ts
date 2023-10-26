import { EntitiesEnum } from '@app/entities/entities';
import { EntitieError } from '@app/errors/entities';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { LayersEnum, Log } from '@utils/log';
import { Response } from 'express';

@Catch(EntitieError)
export class EntitieErrorFilter implements ExceptionFilter {
	catch(exception: EntitieError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		if (exception.entity === EntitiesEnum.vo) {
			Log.error({
				name: exception.name,
				layer: LayersEnum.entitie,
				message: exception.message,
				httpCode: 400,
				stack: exception.stack,
			});

			return response.status(400).json({
				statusCode: 400,
				message:
					'Valores malformados foram detectados, certifique-se de que o conteúdo possui uma boa integridade',
			});
		}

		Log.error({
			name: exception.name,
			layer: LayersEnum.entitie,
			message: exception.message,
			httpCode: 500,
			stack: exception.stack,
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
