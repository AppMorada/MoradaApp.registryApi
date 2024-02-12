import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUser } from '@tests/inMemoryDatabase/user';
import { CryptAdapter, ICryptCompare } from '@app/adapters/crypt';
import { BcryptAdapter } from '@app/adapters/bcrypt/bcryptAdapter';
import { CheckPasswordGuard } from '../checkPassword.guard';
import { userFactory } from '@tests/factories/user';
import { condominiumRelUserFactory } from '@tests/factories/condominiumRelUser';
import { createMockExecutionContext } from '@tests/guards/executionContextSpy';
import { GuardErrors } from '@app/errors/guard';

describe('Password guard test', () => {
	let cryptAdapter: CryptAdapter;

	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUser;

	let checkPasswordGuard: CheckPasswordGuard;

	beforeEach(async () => {
		cryptAdapter = new BcryptAdapter();

		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUser(inMemoryContainer);

		checkPasswordGuard = new CheckPasswordGuard(cryptAdapter, userRepo);
	});

	it('should be able to validate password guard', async () => {
		BcryptAdapter.prototype.hash = jest.fn(async (input: string) => {
			return new Promise((resolve) => resolve(input));
		});
		BcryptAdapter.prototype.compare = jest.fn(
			async (input: ICryptCompare) => {
				return input.data === input.hashedData;
			},
		);

		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();
		userRepo.create({ user, condominiumRelUser });

		const context = createMockExecutionContext({
			body: {
				email: user.email.value,
				password: user.password.value,
			},
		});

		await expect(
			checkPasswordGuard.canActivate(context),
		).resolves.toBeTruthy();

		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.find).toEqual(1);
	});

	it('should throw one error - incorrect password and email', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();
		userRepo.create({ user, condominiumRelUser });

		const context = createMockExecutionContext({
			body: {
				email: user.email.value,
				password: 'wrongpassword',
			},
		});

		await expect(checkPasswordGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'Email ou senha incorretos',
			}),
		);

		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.find).toEqual(1);
	});

	it('should throw one error - user not found', async () => {
		const context = createMockExecutionContext({
			body: {
				email: 'johndoe@email.com',
				password: '12345678',
			},
		});

		await expect(checkPasswordGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'Usuário não existe',
			}),
		);
	});
});
