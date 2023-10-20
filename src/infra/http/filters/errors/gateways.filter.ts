import { GatewayErrors, GatewaysErrorsTags } from '@infra/http/gateways/errors';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

interface IGatewayError {
	name: string;
	tag: GatewaysErrorsTags;
	message: string;
	httpCode: number;
}

@Catch(GatewayErrors)
export class GatewayErrorFilter implements ExceptionFilter {
	private possibleErrors: IGatewayError[] = [
		{
			name: 'Invalid Result',
			tag: GatewaysErrorsTags.InvalidResult,
			message:
				'Bad Request - Could not achieve the expected result, please check your inputs',
			httpCode: 400,
		},
	];

	catch(exception: GatewayErrors, host: ArgumentsHost) {
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
			message: 'Internal server error',
		});
	}
}
