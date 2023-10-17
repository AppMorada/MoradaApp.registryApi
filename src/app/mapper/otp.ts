import { Code } from '@app/entities/VO/code';
import { OTP } from '@app/entities/OTP';

interface IConvertToObject {
	id?: string;
	ttl?: number;
	userId: string;
	code: Code;
	createdAt?: Date;
}

type TClassTOObject = Required<IConvertToObject>;

export class OTPMapper {
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

	static toObject(input: OTP): TClassTOObject {
		return {
			id: input.id,
			ttl: input.ttl,
			userId: input.userId,
			code: input.code,
			createdAt: input.createdAt,
		};
	}
}
