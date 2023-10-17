import { OTP, TInputOTPProps } from '@app/entities/OTP';
import { Code } from '@app/entities/VO/code';

type TOverride = Partial<TInputOTPProps>;

export function otpFactory(input: TOverride = {}, id?: string) {
	return new OTP(
		{
			userId: 'user id',
			condominiumId: 'condominium id',
			code: new Code('123456'),
			ttl: 1000,
			...input,
		},
		id,
	);
}
