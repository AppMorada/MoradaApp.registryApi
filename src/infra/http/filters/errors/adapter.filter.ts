import { AdapterError } from '@app/errors/adapter';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { LayersEnum, Log } from '@utils/log';
import { Response } from 'express';

@Catch(AdapterError)
export class AdapterErrorFilter implements ExceptionFilter {
	catch(exception: AdapterError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		Log.error({
			name: exception.name,
			layer: LayersEnum.adapter,
			message: exception.message,
			httpCode: exception.httpCode ?? 500,
			stack: exception.stack,
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
