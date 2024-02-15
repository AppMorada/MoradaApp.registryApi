import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { FirestoreCustomError } from '@infra/storages/db/firestore/error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

/** Usado para filtrar erros do FirestoreCustomError */
@Catch(FirestoreCustomError)
export class FirestoreCustomErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	catch(exception: FirestoreCustomError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		this.logger.error({
			name: `${exception.name} - ${exception.name}`,
			layer: LayersEnum.database,
			description: exception.message,
			stack: exception.stack,
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
