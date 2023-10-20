import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { IHttpClientCall, HttpAdapter, IHttpClientCallReturn } from '../http';

export class FetchAdapter implements HttpAdapter {
	async call(input: IHttpClientCall): Promise<IHttpClientCallReturn> {
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

				if (res.status >= 400)
					throw new HttpException(
						'Can\'t contact external service',
						res.status,
					);

				return {
					status,
					headers,
					body,
				};
			})
			.catch((err) => {
				if (!(err instanceof HttpException))
					throw new InternalServerErrorException();

				throw err;
			});
	}
}
