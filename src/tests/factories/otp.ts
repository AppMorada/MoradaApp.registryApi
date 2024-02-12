import { OTP, TInputOTPProps } from '@app/entities/OTP';
import { UUID } from '@app/entities/VO';

type TOverride = Partial<TInputOTPProps>;

export function otpFactory(input: TOverride = {}, id?: string) {
	return new OTP(
		{
			userId: UUID.genV4().value,
			code: '123456',
			ttl: 1000,
			...input,
		},
		id,
	);
}
