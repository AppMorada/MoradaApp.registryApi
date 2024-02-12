import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { DateFormats } from '@utils/dateFormats';
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
		const date = new Date();
		const anonymous = randomUUID();

		this.logger.info({
			name: `"${req.path}" acessado`,
			description: `Um usuário não identificado esta acessando a rota "${
				req.path
			}" às "${DateFormats.prettify(
				date,
			)}" usando o id temporário "${anonymous}" e o método "${
				req.method
			}"`,
			layer: LayersEnum.interceptors,
		});

		return next.handle().pipe(
			tap(() => {
				this.logger.info({
					name: `"${req.path}" acesso finalizado`,
					description: `Acesso bem sucedido por "${anonymous}"`,
					layer: LayersEnum.interceptors,
				});
			}),
		);
	}
}
