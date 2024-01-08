import { CryptAdapter } from '@registry:app/adapters/crypt';
import { HmacInviteGuard } from '../hmac-invite.guard';
import { InMemoryContainer } from '@registry:tests/inMemoryDatabase/inMemoryContainer';
import { NodemailerAdapter } from '@registry:app/adapters/nodemailer/nodemailerAdapter';
import { InMemoryInvite } from '@registry:tests/inMemoryDatabase/invites';
import { BcryptAdapter } from '@registry:app/adapters/bcrypt/bcryptAdapter';
import { userFactory } from '@registry:tests/factories/user';
import { condominiumRelUserFactory } from '@registry:tests/factories/condominiumRelUser';
import { createMockExecutionContext } from '@registry:tests/guards/executionContextSpy';
import { inviteFactory } from '@registry:tests/factories/invite';
import { Invite } from '@registry:app/entities/invite';
import { generateStringCodeContent } from '@registry:utils/generateStringCodeContent';
import { GuardErrors } from '@registry:app/errors/guard';

describe('HMAC invite test', () => {
	let cryptAdapter: CryptAdapter;

	let inMemoryContainer: InMemoryContainer;
	let inviteRepo: InMemoryInvite;

	let hmacInviteGuard: HmacInviteGuard;

	async function generateInvite({
		invite,
		key,
	}: {
		invite: Invite;
		key: string;
	}) {
		const inputData = generateStringCodeContent({
			id: invite.id,
			email: invite.email,
			requiredLevel: invite.type,
			condominiumId: invite.condominiumId,
		});

		return await cryptAdapter.hashWithHmac({ key, data: inputData });
	}

	beforeEach(() => {
		NodemailerAdapter.prototype.send = jest.fn(async () => {});
		inMemoryContainer = new InMemoryContainer();
		inviteRepo = new InMemoryInvite(inMemoryContainer);

		cryptAdapter = new BcryptAdapter();

		hmacInviteGuard = new HmacInviteGuard(cryptAdapter, inviteRepo);
	});

	it('should be able to validate hmac invite', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();
		const invite = inviteFactory({
			email: user.email.value,
			type: condominiumRelUser.level.value,
			condominiumId: condominiumRelUser.condominiumId.value,
		});
		await inviteRepo.create({ invite });
		const inviteAsHash = await generateInvite({
			invite,
			key: process.env.INVITE_TOKEN_KEY as string,
		});

		const context = createMockExecutionContext({
			query: {
				invite: inviteAsHash,
			},
			body: {
				email: user.email.value,
			},
		});

		await expect(
			hmacInviteGuard.canActivate(context),
		).resolves.toBeTruthy();

		expect(inviteRepo.calls.create).toEqual(1);
		expect(inviteRepo.calls.find).toEqual(1);
	});

	it('should throw one error - invite is invalid', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();
		const invite = inviteFactory({
			email: user.email.value,
			type: condominiumRelUser.level.value,
			condominiumId: condominiumRelUser.condominiumId.value,
		});
		await inviteRepo.create({ invite });

		const context = createMockExecutionContext({
			query: {
				invite: 'wrong invite',
			},
			body: {
				email: user.email.value,
			},
		});

		await expect(hmacInviteGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'O convite é inválido',
			}),
		);

		expect(inviteRepo.calls.create).toEqual(1);
		expect(inviteRepo.calls.find).toEqual(1);
	});

	it('should throw one error - invite doesn\'t exist', async () => {
		const context = createMockExecutionContext({
			body: {
				email: 'johndoe@email.com',
			},
		});

		await expect(hmacInviteGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'O convite é inválido',
			}),
		);

		expect(inviteRepo.calls.create).toEqual(0);
		expect(inviteRepo.calls.find).toEqual(0);
	});
});
