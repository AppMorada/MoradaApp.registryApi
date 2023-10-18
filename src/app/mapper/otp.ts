import { Code } from '@app/entities/VO/code';
import { OTP } from '@app/entities/OTP';

interface IConvertToObject {
	id?: string;
	ttl?: number;
	userId?: string;
	requiredLevel?: number;
	condominiumId: string;
	code: Code;
	createdAt?: Date;
}

interface IClassToObject {
	id: string;
	ttl: number;
	userId?: string;
	requiredLevel?: number;
	condominiumId: string;
	code: Code;
	createdAt: Date;
}

export class OTPMapper {
	static toClass(input: IConvertToObject): OTP {
		return new OTP(
			{
				ttl: input.ttl,
				userId: input.userId,
				requiredLevel: input.requiredLevel,
				condominiumId: input.condominiumId,
				code: input.code,
				createdAt: input.createdAt,
			},
			input.id,
		);
	}

	static toObject(input: OTP): IClassToObject {
		return {
			id: input.id,
			requiredLevel: input.requiredLevel,
			ttl: input.ttl,
			condominiumId: input.condominiumId,
			userId: input.userId,
			code: input.code,
			createdAt: input.createdAt,
		};
	}
}
