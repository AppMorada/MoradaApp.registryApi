import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { GuardErrors } from '@app/errors/guard';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

/** Usado para filtrar erros dos Guards */
@Catch(GuardErrors)
export class GuardErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	catch(exception: GuardErrors, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		this.logger.error({
			name: `Camada de autenticação - ${exception.name}`,
			layer: LayersEnum.auth,
			description: exception.message,
			stack: exception.stack,
		});

		return response.status(401).json({
			statusCode: 401,
			message: 'Acesso não autorizado',
		});
	}
}
