import { Code } from '@app/entities/VO/code';
import { OTP } from '@app/entities/OTP';
import { TReplace } from '@utils/replace';

interface IConvertToObject {
	id?: string;
	ttl?: number;
	userId?: string;
	condominiumId: string;
	code: Code;
	createdAt?: Date;
}

type TClassTOObject = TReplace<Required<IConvertToObject>, { userId?: string }>;

export class OTPMapper {
	static toClass(input: IConvertToObject): OTP {
		return new OTP(
			{
				ttl: input.ttl,
				userId: input.userId,
				condominiumId: input.condominiumId,
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
			condominiumId: input.condominiumId,
			userId: input.userId,
			code: input.code,
			createdAt: input.createdAt,
		};
	}
}
