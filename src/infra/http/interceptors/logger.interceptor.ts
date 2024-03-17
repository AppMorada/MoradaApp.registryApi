import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogInterceptor implements NestInterceptor {
	constructor(private readonly logger: LoggerAdapter) {}

	intercept(content: ExecutionContext, next: CallHandler): Observable<any> {
		const req = content.switchToHttp().getRequest<Request>();

		this.logger.info({
			name: `"${req.path}" acessado`,
			description: `Method(${req.method})`,
			layer: LayersEnum.interceptors,
		});

		return next.handle().pipe(
			tap(() => {
				this.logger.info({
					name: `"${req.path}" acesso finalizado sem erros`,
					description: `Method(${req.method})`,
					layer: LayersEnum.interceptors,
				});
			}),
		);
	}
}
