import { otpFactory } from '@registry:tests/factories/otp';
import { OTPRedisMapper } from './otp';

describe('OTP Mapper Test', () => {
	it('should be able to convert OTP into object redis and class', () => {
		const otp = otpFactory();

		const otpInObject = OTPRedisMapper.toRedis(otp);
		const sut = OTPRedisMapper.toClass(otpInObject);

		expect(sut.equalTo(otp)).toBeTruthy();
	});
});
