import { FirestoreCustomError } from '@infra/storages/db/firestore/error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(FirestoreCustomError)
export class FirestoreCustomErrorFilter implements ExceptionFilter {
	constructor() {}

	catch(_: FirestoreCustomError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
