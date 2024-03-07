import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	catch(err: UnprocessableEntityException, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const request = context.getRequest<Request>();

		this.logger.error({
			name: `SessionId(${request.sessionId}): Não foi possível processar as entidades envolvidas`,
			layer: LayersEnum.controller,
			description: err.message,
		});

		return response.status(422).json({
			statusCode: 422,
			message: 'Não foi possível processar os dados',
		});
	}
}
