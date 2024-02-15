import { CryptAdapter } from '@app/adapters/crypt';
import { HmacInviteGuard } from '../hmac-invite.guard';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { NodemailerAdapter } from '@app/adapters/nodemailer/nodemailerAdapter';
import { InMemoryInvite } from '@tests/inMemoryDatabase/invites';
import { BcryptAdapter } from '@app/adapters/bcrypt/bcryptAdapter';
import { userFactory } from '@tests/factories/user';
import { condominiumRelUserFactory } from '@tests/factories/condominiumRelUser';
import { createMockExecutionContext } from '@tests/guards/executionContextSpy';
import { inviteFactory } from '@tests/factories/invite';
import { Invite } from '@app/entities/invite';
import { generateStringCodeContent } from '@utils/generateStringCodeContent';
import { GuardErrors } from '@app/errors/guard';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { GetKeyService } from '@app/services/getKey.service';
import { Key } from '@app/entities/key';
import { KeysEnum } from '@app/repositories/key';
import { Level } from '@app/entities/VO';
import { randomBytes } from 'crypto';

describe('HMAC invite test', () => {
	let cryptAdapter: CryptAdapter;

	let inMemoryContainer: InMemoryContainer;
	let inviteRepo: InMemoryInvite;
	let keyRepo: InMemoryKey;

	let getKey: GetKeyService;

	let hmacInviteGuard: HmacInviteGuard;

	async function generateInvite(invite: Invite, key: Key) {
		const inputData = generateStringCodeContent({
			id: invite.id,
			email: invite.email,
			requiredLevel: new Level(0),
			condominiumId: invite.condominiumId,
		});

		return await cryptAdapter.hashWithHmac({
			key: key.actual.content,
			data: inputData,
		});
	}

	beforeEach(async () => {
		NodemailerAdapter.prototype.send = jest.fn(async () => {});
		inMemoryContainer = new InMemoryContainer();
		inviteRepo = new InMemoryInvite(inMemoryContainer);
		keyRepo = new InMemoryKey(inMemoryContainer);

		getKey = new GetKeyService(keyRepo);

		cryptAdapter = new BcryptAdapter();

		hmacInviteGuard = new HmacInviteGuard(cryptAdapter, inviteRepo, getKey);

		const inviteKey = new Key({
			ttl: 1000 * 60 * 60,
			name: KeysEnum.INVITE_TOKEN_KEY,
			actual: {
				content: randomBytes(100).toString('hex'),
				buildedAt: Date.now(),
			},
		});

		await keyRepo.create(inviteKey);
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
		const { key } = await getKey.exec({ name: KeysEnum.INVITE_TOKEN_KEY });
		const inviteAsHash = await generateInvite(invite, key);

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
