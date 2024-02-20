import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response, Request } from 'express';
import { QueryFailedError } from 'typeorm';

interface ITypeORMError {
	name: string;
	code: string;
	message: string;
	httpCode: number;
}

/** Usado para filtrar erros do Prisma */
@Catch(QueryFailedError)
export class TypeORMErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	private possibleErrors: ITypeORMError[] = [
		{
			name: 'Erro ao criar dado repetido',
			code: '23505',
			message: 'Acesso não autorizado',
			httpCode: 401,
		},
	];

	catch(exception: QueryFailedError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const request = context.getRequest<Request>();

		const error = this.possibleErrors.find((item) => {
			return item.code === exception.driverError?.code;
		});

		if (error) {
			this.logger.error({
				name: `SessionId(${request.sessionId}): ${error.name} - ${exception.driverError.code}`,
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
			name: `SessionId(${request.sessionId}): ${exception.name}`,
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