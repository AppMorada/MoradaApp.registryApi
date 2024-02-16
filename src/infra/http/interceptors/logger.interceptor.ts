import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/** Usado para interceptar e realizar os logs da aplicação */
@Injectable()
export class LogInterceptor implements NestInterceptor {
	constructor(private readonly logger: LoggerAdapter) {}

	intercept(content: ExecutionContext, next: CallHandler): Observable<any> {
		const req = content.switchToHttp().getRequest<Request>();
		const sessionId = randomUUID();
		req.sessionId = sessionId;

		this.logger.info({
			name: `"${req.path}" acessado`,
			description: `SessionId(${sessionId}) - Method(${req.method})`,
			layer: LayersEnum.interceptors,
		});

		return next.handle().pipe(
			tap(() => {
				this.logger.info({
					name: `"${req.path}" acesso finalizado sem erros`,
					description: `SessionId(${sessionId}) - Method(${req.method})`,
					layer: LayersEnum.interceptors,
				});
			}),
		);
	}
}
