import { BcryptAdapter } from '@app/adapters/bcrypt/bcryptAdapter';
import { CryptAdapter } from '@app/adapters/crypt';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUser } from '@tests/inMemoryDatabase/user';
import { CheckTFACodeGuard } from '../checkTFACode.guard';
import { userFactory } from '@tests/factories/user';
import { condominiumRelUserFactory } from '@tests/factories/condominiumRelUser';
import { generateStringCodeContent } from '@utils/generateStringCodeContent';
import { User } from '@app/entities/user';
import { createMockExecutionContext } from '@tests/guards/executionContextSpy';
import { GuardErrors } from '@app/errors/guard';

jest.mock('nodemailer');

describe('Check TFA Code guard test', () => {
	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUser;
	let cryptAdapter: CryptAdapter;
	let checkTFACodeGuard: CheckTFACodeGuard;

	async function genCode(user: User) {
		let code = generateStringCodeContent({
			email: user.email,
			id: user.id,
		});
		const key = process.env.TFA_TOKEN_KEY as string;

		const metadata = JSON.stringify({
			iat: Date.now(),
			exp: Date.now() + 1000 * 60 * 60 * 3,
		});
		code = `${btoa(metadata)}.${btoa(code)}`;

		const inviteSignature = await cryptAdapter.hashWithHmac({
			data: code,
			key,
		});
		return `${btoa(metadata)}.${btoa(inviteSignature)}`;
	}

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUser(inMemoryContainer);
		cryptAdapter = new BcryptAdapter();

		checkTFACodeGuard = new CheckTFACodeGuard(userRepo, cryptAdapter);
	});

	it('should be able to validate the CheckTFACodeGuard', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();
		await userRepo.create({ user, condominiumRelUser });

		const code = await genCode(user);
		const context = createMockExecutionContext({
			headers: {
				authorization: `Bearer ${code}`,
			},
			body: {
				email: user.email.value,
			},
		});

		await expect(
			checkTFACodeGuard.canActivate(context),
		).resolves.toBeTruthy();

		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.find).toEqual(1);
	});

	it('should throw one error - invalid code', async () => {
		const context = createMockExecutionContext({});

		await expect(checkTFACodeGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'O código é inválido',
			}),
		);

		expect(userRepo.calls.create).toEqual(0);
		expect(userRepo.calls.find).toEqual(0);
	});

	it('should throw one error - invalid code', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();
		await userRepo.create({ user, condominiumRelUser });

		const context = createMockExecutionContext({
			headers: {
				authorization: `Bearer ${btoa(
					JSON.stringify({ msg: 'wrong' }),
				)}.${btoa(JSON.stringify({ msg: 'token' }))}`,
			},
			body: {
				email: user.email.value,
			},
		});

		await expect(checkTFACodeGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'O código é inválido',
			}),
		);

		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.find).toEqual(1);
	});
});
