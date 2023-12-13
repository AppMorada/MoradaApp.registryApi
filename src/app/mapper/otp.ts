import { Code } from '@app/entities/VO/code';
import { OTP } from '@app/entities/OTP';
import { Level } from '@app/entities/VO/level';

interface IConvertToObject {
	id?: string;
	ttl?: number;
	userId?: string;
	requiredLevel: number;
	condominiumId: string;
	code: string;
	createdAt?: Date;
}

interface IClassToObject {
	id: string;
	ttl: number;
	userId?: string;
	requiredLevel: number;
	condominiumId: string;
	code: string;
	createdAt: Date;
}

export class OTPMapper {
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

	static toObject(input: OTP): IClassToObject {
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
