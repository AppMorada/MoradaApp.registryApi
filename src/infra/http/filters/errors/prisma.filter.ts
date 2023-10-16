import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
			name: 'Unique constraint failed',
			code: 'P2002',
			message: 'Unauthorized',
			httpCode: 401,
		},
		{
			name: 'Database {database_name} already exists',
			code: 'P1009',
			message: 'Unauthorized',
			httpCode: 401,
		},
		{
			name: 'Database {database_file_name} does not exist',
			code: 'P1003',
			message: 'Not Found',
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

		if (error)
			return response.status(error.httpCode).json({
				statusCode: error.httpCode,
				message: error.message,
			});

		return response.status(500).json({
			statusCode: 500,
			message: 'Internal server error',
		});
	}
}
