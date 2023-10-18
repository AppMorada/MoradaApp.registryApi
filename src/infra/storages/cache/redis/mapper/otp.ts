import { OTP } from '@app/entities/OTP';
import { Code } from '@app/entities/VO/code';
import { Level } from '@app/entities/VO/level';

interface IClassToRawObject {
	userId?: string;
	id: string;
	requiredLevel: number;
	ttl: number;
	condominiumId: string;
	code: string;
	createdAt: Date;
}

export class OTPRedisMapper {
	static toRedis(input: OTP): IClassToRawObject {
		return {
			id: input.id,
			requiredLevel: input.requiredLevel.value,
			userId: input.userId,
			code: input.code.value,
			condominiumId: input.condominiumId,
			createdAt: input.createdAt,
			ttl: input.ttl,
		};
	}

	static toClass(input: IClassToRawObject): OTP {
		return new OTP(
			{
				code: new Code(input.code),
				requiredLevel: new Level(input.requiredLevel),
				createdAt: input.createdAt,
				ttl: input.ttl,
				userId: input.userId,
				condominiumId: input.condominiumId,
			},
			input.id,
		);
	}
}
