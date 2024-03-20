import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import {
	DatabaseCustomError,
	DatabaseCustomErrorsTags,
} from '@infra/storages/db/error';
import { ReportAdapter } from '@app/adapters/reports';

interface IFirestoreErrors {
	name: string;
	tag: DatabaseCustomErrorsTags;
	message: string;
	httpCode: number;
}

@Catch(DatabaseCustomError)
export class DatabaseCustomErrorFilter implements ExceptionFilter {
	constructor(
		private readonly logger: LoggerAdapter,
		private readonly report: ReportAdapter,
	) {}

	private readonly possibleErrors: IFirestoreErrors[] = [
		{
			name: 'Conteúdo não existe - SafeSearch ativo',
			tag: DatabaseCustomErrorsTags.safeSearchEnabled,
			message: 'O conteúdo solicitado não foi encontrado',
			httpCode: 404,
		},
		{
			name: 'Conteúdo não existe',
			tag: DatabaseCustomErrorsTags.contentDoesntExists,
			message: 'O conteúdo solicitado não foi encontrado',
			httpCode: 404,
		},
		{
			name: 'Conteúdo já existe',
			tag: DatabaseCustomErrorsTags.contentAlreadyExists,
			message: 'O conteúdo a ser criado já existe',
			httpCode: 401,
		},
		{
			name: 'Referência perdida',
			tag: DatabaseCustomErrorsTags.refLost,
			message: 'O conteúdo solicitado não foi encontrado',
			httpCode: 404,
		},
		{
			name: 'Muitas entidades registradas',
			tag: DatabaseCustomErrorsTags.tooManyEntities,
			message: 'Acesso não autorizado',
			httpCode: 401,
		},
		{
			name: 'Acesso não autorizado',
			tag: DatabaseCustomErrorsTags.alreadyRegisteredCondominiumRelUser,
			message: 'Acesso não autorizado',
			httpCode: 401,
		},
		{
			name: 'Inputs errados',
			tag: DatabaseCustomErrorsTags.wrongInputLevel,
			message: 'Acesso não autorizado',
			httpCode: 401,
		},
	];

	catch(exception: DatabaseCustomError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const request = context.getRequest<Request>();

		const error = this.possibleErrors.find((item) => {
			return item.tag === exception.tag;
		});

		if (error) {
			this.logger.error({
				name: `${error.name} - ${exception.name}`,
				layer: LayersEnum.database,
				description: error.message,
				stack: exception.stack,
			});

			return response.status(error.httpCode).json({
				statusCode: error.httpCode,
				message: error.message,
			});
		}

		this.logger.error({
			name: `${exception.name}`,
			layer: LayersEnum.database,
			description: exception.message,
			stack: exception.stack,
		});
		this.report.error({
			err: exception,
			statusCode: 500,
			url: request.url,
			method: request.method,
			userAgent: request.headers?.['user-agent'],
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
