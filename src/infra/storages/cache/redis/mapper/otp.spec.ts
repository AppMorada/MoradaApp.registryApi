import { otpFactory } from '@tests/factories/otp';
import { OTPRedisMapper } from './otp';

describe('OTP Mapper Test', () => {
	it('should be able to convert OTP into redis object and class', () => {
		const otp = otpFactory();

		const otpInObjt = OTPRedisMapper.toRedis(otp);
		const sut = OTPRedisMapper.toClass(otpInObjt);

		expect(sut.equalTo(otp)).toBeTruthy();
	});
});
