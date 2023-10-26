import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LayersEnum, Log } from '@utils/log';
import { Response } from 'express';

interface IPrismaError {
	name: string;
	code: string;
	message: string;
	httpCode: number;
}

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaErrorFilter implements ExceptionFilter {
	private possibleErrors: IPrismaError[] = [
		{
			name: 'Dado não existe',
			code: 'P2025',
			message: 'Não foi possível deletar o dado, pois o mesmo não existe',
			httpCode: 404,
		},
		{
			name: 'Erro ao criar dado repetido',
			code: 'P2002',
			message: 'Acesso não autorizado',
			httpCode: 401,
		},
		{
			name: 'Dado já existe',
			code: 'P1009',
			message: 'Acesso não autorizado',
			httpCode: 401,
		},
		{
			name: 'Dado não existe',
			code: 'P1003',
			message: 'Não encontrado',
			httpCode: 404,
		},
	];

	catch(
		exception: Prisma.PrismaClientKnownRequestError,
		host: ArgumentsHost,
	) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		const error = this.possibleErrors.find((item) => {
			return item.code === exception.code;
		});

		if (error) {
			Log.error({
				name: `${error.name} - ${exception.code}`,
				layer: LayersEnum.database,
				message: error.message,
				httpCode: error.httpCode,
				stack: exception.stack,
			});

			return response.status(error.httpCode).json({
				statusCode: error.httpCode,
				message: error.message,
			});
		}

		Log.error({
			name: `${exception.name} - ${exception.code}`,
			layer: LayersEnum.database,
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
