import {
	ArgumentsHost,
	BadRequestException,
	Catch,
	ExceptionFilter,
} from '@nestjs/common';
import { LayersEnum, Log } from '@utils/log';
import { isArray, isNumber, isString } from 'class-validator';
import { Response } from 'express';

interface IBodyProps {
	message: Array<string>;
	error: string;
	statusCode: number;
}

@Catch(BadRequestException)
export class ClassValidatorErrorFilter implements ExceptionFilter {
	validateBody(input: any): input is IBodyProps {
		return (
			'message' in input &&
			isArray<string>(input['message']) &&
			'error' in input &&
			isString(input['error']) &&
			'statusCode' in input &&
			isNumber(input['statusCode'])
		);
	}

	catch(exception: BadRequestException, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		const body = exception.getResponse() as IBodyProps;
		if (!this.validateBody(body))
			return response.status(400).json({
				statusCode: 500,
				message: 'Erro interno do servidor',
			});

		Log.error({
			name: 'Requisição ruim',
			layer: LayersEnum.dto,
			message: body.message,
			httpCode: 400,
			stack: exception.stack,
		});

		return response.status(400).json({
			statusCode: 400,
			name: 'Requisição ruim',
			message: body.message,
		});
	}
}
