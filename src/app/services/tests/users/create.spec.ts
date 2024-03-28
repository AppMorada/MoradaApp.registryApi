import { CreateUserService } from '../../user/create.service';
import { userFactory } from '@tests/factories/user';
import { CryptSpy } from '@tests/adapters/cryptSpy';
import { InMemoryInvite } from '@tests/inMemoryDatabase/invites';
import { inviteFactory } from '@tests/factories/invite';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { InMemoryCommunityMembersWriteOps } from '@tests/inMemoryDatabase/communityMember/write';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Create user test', () => {
	let sut: CreateUserService;
	let inMemoryContainer: InMemoryContainer;
	let inviteRepo: InMemoryInvite;
	let memberRepo: InMemoryCommunityMembersWriteOps;
	let crypt: CryptSpy;

	beforeEach(() => {
		crypt = new CryptSpy();
		inMemoryContainer = new InMemoryContainer();
		inviteRepo = new InMemoryInvite(inMemoryContainer);
		memberRepo = new InMemoryCommunityMembersWriteOps(inMemoryContainer);
		sut = new CreateUserService(inviteRepo, crypt);
	});

	it('should be able to create a user', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const member = condominiumMemberFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		const communityInfos = communityInfosFactory({
			memberId: member.id.value,
		});
		const invite = inviteFactory({
			memberId: member.id.value,
			recipient: uniqueRegistry.email.value,
		});
		await memberRepo.createMany({
			members: [
				{
					invite,
					content: member,
					communityInfos,
					rawUniqueRegistry: {
						email: uniqueRegistry.email,
						CPF: uniqueRegistry.CPF!,
					},
				},
			],
		});

		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		await sut.exec({
			user,
			invite,
			flatAndRawUniqueRegistry: {
				email: uniqueRegistry.email.value,
				CPF: uniqueRegistry.CPF!.value,
			},
		});
		expect(inviteRepo.calls.transferToUserResources).toEqual(1);
	});
});
