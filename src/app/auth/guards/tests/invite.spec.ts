import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { createMockExecutionContext } from '@tests/guards/executionContextSpy';
import { userFactory } from '@tests/factories/user';
import { GuardErrors } from '@app/errors/guard';
import { CryptSpy } from '@tests/adapters/cryptSpy';
import { InMemoryInvite } from '@tests/inMemoryDatabase/invites';
import { InviteGuard } from '../invite.guard';
import { inviteFactory } from '@tests/factories/invite';
import { CPF } from '@app/entities/VO';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Invite guard test', () => {
	let sut: InviteGuard;

	let cryptSpy: CryptSpy;

	let inviteRepo: InMemoryInvite;
	let container: InMemoryContainer;

	beforeEach(async () => {
		container = new InMemoryContainer();
		inviteRepo = new InMemoryInvite(container);

		cryptSpy = new CryptSpy();
		sut = new InviteGuard(inviteRepo, cryptSpy);
	});

	it('should be able to validate a invite guard', async () => {
		const cpf = '614.159.380-16';
		const code = '12345678';

		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const invite = inviteFactory({
			recipient: uniqueRegistry.email.value,
			code: `${new CPF(cpf).value}-${code}`,
		});
		inviteRepo.invites.push(invite);
		inviteRepo.invites.push(inviteFactory());

		const context = createMockExecutionContext({
			body: {
				name: user.name.value,
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CPF: cpf,
				code: code,
			},
		});

		await sut.canActivate(context);
		expect(inviteRepo.calls.find).toEqual(1);
		expect(cryptSpy.calls.compare).toEqual(1);
	});

	it('should throw one error - invite doesn\'t exist', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const context = createMockExecutionContext({
			body: {
				name: user.name.value,
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CPF: '614.159.380-16',
				code: '12345678',
			},
		});

		expect(sut.canActivate(context)).rejects.toThrow(
			new GuardErrors({ message: 'Invite not found' }),
		);
	});

	it('should throw one error - wrong code exist', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const invite = inviteFactory({
			recipient: uniqueRegistry.email.value,
		});
		inviteRepo.invites.push(invite);
		inviteRepo.invites.push(inviteFactory());

		const context = createMockExecutionContext({
			body: {
				name: user.name.value,
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CPF: '614.159.380-16',
				code: '12345678',
			},
		});

		expect(sut.canActivate(context)).rejects.toThrow(
			new GuardErrors({ message: 'Código inválido' }),
		);
	});
});
