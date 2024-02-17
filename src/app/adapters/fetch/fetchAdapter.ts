import { HttpException, Injectable } from '@nestjs/common';
import { IHttpClientCall, HttpAdapter, IHttpClientCallReturn } from '../http';
import { AdapterError } from '@app/errors/adapter';

@Injectable()
export class FetchAdapter implements HttpAdapter {
	async call(input: IHttpClientCall): Promise<IHttpClientCallReturn> {
		let statusCode: number | undefined;

		return await fetch(input.url, {
			method: input.method,
			headers: input.headers,
			body: input.body,
		})
			.then(async (res) => {
				const status = res.status;
				const headers = res.headers;
				const body: any = res.headers
					.get('content-type')
					?.includes('application/json')
					? await res.json()
					: undefined;

				if (res.status >= 400) {
					statusCode = res.status;
					throw new HttpException(
						'Requisição mal sucedida',
						res.status,
					);
				}

				return {
					status,
					headers,
					body,
				};
			})
			.catch((err) => {
				if (!(err instanceof HttpException))
					throw new AdapterError({
						message: `Não foi possível estabelecer uma conexão com o serviço de URL ${input.url}, pois o adaptador responsável por tal tarefa disparou um erro não reconhecível`,
					});

				throw new AdapterError({
					message: `A requisição do serviço de URL ${input.url} falhou com o código ${statusCode}`,
					httpCode: statusCode,
				});
			});
	}
}
