import { InMemoryUserRead } from '@tests/inMemoryDatabase/user/read';
import { CryptAdapter, ICryptCompare } from '@app/adapters/crypt';
import { BcryptAdapter } from '@app/adapters/bcrypt/bcryptAdapter';
import { CheckPasswordGuard } from '../checkPassword.guard';
import { userFactory } from '@tests/factories/user';
import { createMockExecutionContext } from '@tests/guards/executionContextSpy';
import { GuardErrors } from '@app/errors/guard';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Password guard test', () => {
	let cryptAdapter: CryptAdapter;
	let readUserRepo: InMemoryUserRead;

	let checkPasswordGuard: CheckPasswordGuard;

	const user = userFactory();
	const uniqueRegistry = uniqueRegistryFactory();

	beforeEach(async () => {
		cryptAdapter = new BcryptAdapter();
		readUserRepo = new InMemoryUserRead();

		checkPasswordGuard = new CheckPasswordGuard(cryptAdapter, readUserRepo);

		InMemoryUserRead.prototype.exec = jest.fn(async () => {
			++readUserRepo.calls.exec;
			return { user, uniqueRegistry };
		});
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

		const context = createMockExecutionContext({
			body: {
				email: uniqueRegistry.email.value,
				password: user.password.value,
			},
		});

		await expect(
			checkPasswordGuard.canActivate(context),
		).resolves.toBeTruthy();

		expect(readUserRepo.calls.exec).toEqual(1);
	});

	it('should throw one error - incorrect password and email', async () => {
		const context = createMockExecutionContext({
			body: {
				email: uniqueRegistry.email.value,
				password: 'wrongpassword',
			},
		});

		await expect(checkPasswordGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'Email ou senha incorretos',
			}),
		);

		expect(readUserRepo.calls.exec).toEqual(1);
	});
});
