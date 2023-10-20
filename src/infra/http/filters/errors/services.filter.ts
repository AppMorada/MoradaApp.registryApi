import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

interface IServiceErrors {
	tag: ServiceErrorsTags;
	message: string;
	httpCode: number;
}

@Catch(ServiceErrors)
export class ServiceErrorFilter implements ExceptionFilter {
	private possibleErrors: IServiceErrors[] = [
		{
			tag: ServiceErrorsTags.unauthorized,
			message: 'Unauthorized',
			httpCode: 401,
		},
	];

	catch(exception: ServiceErrors, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		const error = this.possibleErrors.find((item) => {
			return item.tag === exception.tag;
		});

		if (error)
			return response.status(error.httpCode).json({
				statusCode: error.httpCode,
				message: error.message,
			});

		return response.status(500).json({
			statusCode: 500,
			message: 'Internal Server Error',
		});
	}
}
