import { JwtService } from '@nestjs/jwt';
import { InMemoryUser } from '@tests/inMemoryDatabase/user';
import { AuthService } from './auth.service';
import { userFactory } from '@tests/factories/user';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { Email } from '@app/entities/VO/email';
import { Password } from '@app/entities/VO/password';

describe('Authenticate users test', () => {
	let authService: AuthService;

	let userRepo: InMemoryUser;
	let tokenService: JwtService;

	beforeEach(() => {
		userRepo = new InMemoryUser();
		tokenService = new JwtService();

		authService = new AuthService(userRepo, tokenService);
	});

	it('should be able to authenticate users', async () => {
		const user = userFactory();
		await userRepo.create({ user });

		const { token } = await authService.exec({
			email: user.email,
			password: user.password,
		});

		expect(
			tokenService.verify(token, {
				secret: process.env.ACCESS_TOKEN_KEY as string,
			}),
		).resolves;
	});

	it('should throw one error: user does not exist', async () => {
		await expect(
			authService.exec({
				email: new Email('Wrong email'),
				password: new Password('fake password'),
			}),
		).rejects.toThrowError(
			new ServiceErrors({
				message: 'Unauthorized',
				tag: ServiceErrorsTags.unauthorized,
			}),
		);
	});
});
