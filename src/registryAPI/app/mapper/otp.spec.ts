import { otpFactory } from '@registry:tests/factories/otp';
import { OTPMapper } from './otp';

describe('OTP Mapper Test', () => {
	it('should be able to convert OTP into object and class', () => {
		const otp = otpFactory();

		const otpInObject = OTPMapper.toObject(otp);
		const sut = OTPMapper.toClass(otpInObject);

		expect(sut.equalTo(otp)).toBeTruthy();
	});
});
