import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	ServiceUnavailableException,
} from '@nestjs/common';
import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { Response, Request } from 'express';

@Catch(ServiceUnavailableException)
export class AxiosCheckErrorFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerAdapter) {}

	catch(exception: ServiceUnavailableException, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const request = context.getRequest<Request>();

		this.logger.error({
			name: `SessionId(${request.sessionId}): ${exception.name}`,
			layer: LayersEnum.gateway,
			description: exception.message,
			stack: exception.stack,
		});

		return response.status(500).json({
			statusCode: 500,
			message: 'Erro interno do servidor',
		});
	}
}
