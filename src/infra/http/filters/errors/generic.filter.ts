import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { LayersEnum, Log } from '@utils/log';
import { Response } from 'express';

@Catch()
export class GenericErrorFilter implements ExceptionFilter {
	catch(exception: Error, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		Log.error({
			name: exception.name,
			layer: LayersEnum.unknown,
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
