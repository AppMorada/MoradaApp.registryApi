import { Code, Level } from '@registry:app/entities/VO';
import { OTP } from '@registry:app/entities/OTP';

interface IConvertToObject {
	id?: string;
	ttl?: number;
	userId?: string;
	requiredLevel: number;
	condominiumId: string;
	code: string;
	createdAt?: Date;
}

export interface IOTPInObject {
	id: string;
	ttl: number;
	userId?: string;
	requiredLevel: number;
	condominiumId: string;
	code: string;
	createdAt: Date;
}

export class OTPMapper {
	/**
	 * @deprecated
	 **/
	static toClass(input: IConvertToObject): OTP {
		return new OTP(
			{
				ttl: input.ttl,
				userId: input.userId,
				requiredLevel: new Level(input.requiredLevel),
				condominiumId: input.condominiumId,
				code: new Code(input.code),
				createdAt: input.createdAt,
			},
			input.id,
		);
	}

	/**
	 * @deprecated
	 **/
	static toObject(input: OTP): IOTPInObject {
		return {
			id: input.id,
			requiredLevel: input.requiredLevel.value,
			ttl: input.ttl,
			condominiumId: input.condominiumId,
			userId: input.userId,
			code: input.code.value,
			createdAt: input.createdAt,
		};
	}
}
