import { JwtService } from '@nestjs/jwt';
import { InMemoryUser } from '@tests/inMemoryDatabase/user';
import { CreateTokenService } from '../createToken.service';
import { userFactory } from '@tests/factories/user';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { condominiumRelUserFactory } from '@tests/factories/condominiumRelUser';

describe('Create token test', () => {
	let createTokenService: CreateTokenService;
	let tokenService: JwtService;

	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUser;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUser(inMemoryContainer);
		tokenService = new JwtService();

		createTokenService = new CreateTokenService(tokenService);
	});

	it('should be able to create token', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();

		await userRepo.create({ user, condominiumRelUser });

		const { accessToken, refreshToken } = await createTokenService.exec({
			user,
		});

		await tokenService.verify(accessToken, {
			secret: process.env.ACCESS_TOKEN_KEY as string,
		});
		await tokenService.verify(refreshToken, {
			secret: process.env.REFRESH_TOKEN_KEY as string,
		});
	});
});
