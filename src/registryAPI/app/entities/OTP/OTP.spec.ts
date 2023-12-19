import { otpFactory } from '@registry:tests/factories/otp';

describe('OTP entity test', () => {
	it('should be able to create OTP entity', () => {
		const sut1 = otpFactory();
		const sut2 = sut1;

		expect(sut1.equalTo(sut2)).toBeTruthy();
	});
});
