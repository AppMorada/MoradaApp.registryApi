import { GuardErrors } from '@app/errors/guard';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { LayersEnum, Log } from '@utils/log';
import { Response } from 'express';

@Catch(GuardErrors)
export class GuardErrorFilter implements ExceptionFilter {
	catch(exception: GuardErrors, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		Log.error({
			name: `Camada de autenticação - ${exception.name}`,
			layer: LayersEnum.auth,
			message: exception.message,
			httpCode: 401,
			stack: exception.stack,
		});

		return response.status(401).json({
			statusCode: 401,
			message: 'Acesso não autorizado',
		});
	}
}
