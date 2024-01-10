import { OTP } from '@registry:app/entities/OTP';

interface IClassToRawObject {
	userId: string;
	id: string;
	ttl: number;
	code: string;
	createdAt: Date;
}

export class OTPRedisMapper {
	/**
	 * Mapeia os dados e tranforma em objeto apto a estar no redis
	 * @param input - Deve conter a classe OTP
	 **/
	static toRedis(input: OTP): IClassToRawObject {
		return {
			id: input.id.value,
			userId: input.userId.value,
			code: input.code.value,
			ttl: input.ttl,
			createdAt: input.createdAt,
		};
	}

	/**
	 * Mapeia os dados vindos do redis e tranforma em uma class
	 * @param input - Deve conter os dados vindos do redis
	 **/
	static toClass(input: IClassToRawObject): OTP {
		return new OTP(
			{
				ttl: input.ttl,
				userId: input.userId,
				code: input.code,
				createdAt: input.createdAt,
			},
			input.id,
		);
	}
}
