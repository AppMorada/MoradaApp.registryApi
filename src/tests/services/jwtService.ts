import { JsonWebTokenError, JwtVerifyOptions } from '@nestjs/jwt';
import { createHmac } from 'node:crypto';

export class JwtServiceMock {
	static async verifyAsync<T extends object = any>(
		token: string,
		options: JwtVerifyOptions | undefined,
	): Promise<T> {
		const [rawHeader, rawBody, rawSignature] = token.split('.');

		const body = atob(decodeURIComponent(rawBody));
		const header = atob(decodeURIComponent(rawHeader));
		const signature = atob(decodeURIComponent(rawSignature));

		if (!options?.secret)
			throw new JsonWebTokenError(
				'Any secret field was provided in options arg, this is obligatory for JwtServiceMock',
			);

		const hmac = createHmac('sha256', options.secret);

		const payload = JSON.stringify({
			header: JSON.parse(header),
			body: JSON.parse(body),
		});
		hmac.update(payload);

		const hash = hmac.digest('hex');
		if (hash !== signature) throw new JsonWebTokenError('Invalid token');

		const parsedBody = JSON.parse(body);
		if (!parsedBody?.iat || !parsedBody?.exp)
			throw new JsonWebTokenError(
				'Token doesn\'t have the iat or exp field',
			);

		if (parsedBody.exp <= Math.floor(Date.now() / 1000))
			throw new JsonWebTokenError('Expired token');

		return body as unknown as T;
	}
}
