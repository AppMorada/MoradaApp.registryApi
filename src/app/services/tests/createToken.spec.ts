import { JwtService } from '@nestjs/jwt';
import { InMemoryUser } from '@tests/inMemoryDatabase/user';
import { CreateTokenService } from '../createToken.service';
import { userFactory } from '@tests/factories/user';
import { InMemoryOTP } from '@tests/inMemoryDatabase/otp';
import { otpFactory } from '@tests/factories/otp';

describe('Create token test', () => {
	let createTokenService: CreateTokenService;
	let tokenService: JwtService;
	let userRepo: InMemoryUser;
	let otpRepo: InMemoryOTP;

	beforeEach(() => {
		userRepo = new InMemoryUser();
		otpRepo = new InMemoryOTP();
		tokenService = new JwtService();

		createTokenService = new CreateTokenService(tokenService, otpRepo);
	});

	it('should be able to create token', async () => {
		const user = userFactory();
		await userRepo.create({ user });

		const otp = otpFactory();
		await otpRepo.create({ email: user.email, otp });

		const { accessToken, refreshToken } = await createTokenService.exec({
			user,
			removeOTP: true,
		});

		await tokenService.verify(accessToken, {
			secret: process.env.ACCESS_TOKEN_KEY as string,
		});
		await tokenService.verify(refreshToken, {
			secret: process.env.REFRESH_TOKEN_KEY as string,
		});
		expect(otpRepo.calls.delete).toEqual(1);
	});
});
