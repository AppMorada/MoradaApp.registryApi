import { OTP } from '@registry:app/entities/OTP';

interface IConvertToObject {
	id?: string;
	ttl: number;
	userId: string;
	code: string;
	createdAt?: Date;
}

export interface IOTPInObject {
	id: string;
	ttl: number;
	userId: string;
	code: string;
	createdAt: Date;
}

export class OTPMapper {
	/**
	 * Método usado para converter um objeto de OTP em classe
	 * @param input - Deve conter os dados em forma de objeto
	 **/
	static toClass(input: IConvertToObject): OTP {
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

	/**
	 * Método usado para converter uma classe de OTP em um objeto
	 * @param input - Deve conter os dados em forma de classe
	 **/
	static toObject(input: OTP): IOTPInObject {
		return {
			id: input.id.value,
			ttl: input.ttl,
			userId: input.userId.value,
			code: input.code.value,
			createdAt: input.createdAt,
		};
	}
}
