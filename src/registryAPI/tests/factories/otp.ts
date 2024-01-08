import { OTP, TInputOTPProps } from '@registry:app/entities/OTP';
import { UUID, Code } from '@registry:app/entities/VO';

type TOverride = Partial<TInputOTPProps>;

export function otpFactory(input: TOverride = {}, id?: string) {
	return new OTP(
		{
			userId: UUID.genV4().value,
			condominiumId: UUID.genV4().value,
			code: new Code('123456'),
			ttl: 1000,
			...input,
		},
		id,
	);
}
