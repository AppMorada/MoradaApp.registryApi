import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	catch(err: UnprocessableEntityException, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		this.logger.error({
			name: 'Não foi possível processar as entidades envolvidas',
			layer: LayersEnum.controller,
			description: err.message,
		});

		return response.status(422).json({
			statusCode: 422,
			message: 'Não foi possível processar os dados',
		});
	}
}
