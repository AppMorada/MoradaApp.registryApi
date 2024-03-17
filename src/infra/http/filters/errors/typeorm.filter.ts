import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface ITypeORMError {
	name: string;
	code: string;
	message: string;
	httpCode: number;
}

@Catch(QueryFailedError)
export class TypeORMErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	private possibleErrors: ITypeORMError[] = [
		{
			name: 'Erro ao criar dado repetido',
			code: '23505',
			message: 'Conteúdo já existe',
			httpCode: 409,
		},
	];

	catch(exception: QueryFailedError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		const error = this.possibleErrors.find((item) => {
			return item.code === exception.driverError?.code;
		});

		if (error) {
			this.logger.error({
				name: `${error.name} - ${exception.driverError.code}`,
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
			name: exception.name,
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
