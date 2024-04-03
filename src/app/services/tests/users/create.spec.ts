import { CreateUserService } from '../../user/create.service';
import { userFactory } from '@tests/factories/user';
import { CryptSpy } from '@tests/adapters/cryptSpy';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { InMemoryCommunityMembersWriteOps } from '@tests/inMemoryDatabase/communityMember/write';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { InMemoryUserWriteOps } from '@tests/inMemoryDatabase/user/write';

describe('Create user test', () => {
	let sut: CreateUserService;
	let inMemoryContainer: InMemoryContainer;
	let memberRepo: InMemoryCommunityMembersWriteOps;
	let userRepo: InMemoryUserWriteOps;
	let crypt: CryptSpy;

	beforeEach(() => {
		crypt = new CryptSpy();
		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUserWriteOps(inMemoryContainer);
		memberRepo = new InMemoryCommunityMembersWriteOps(inMemoryContainer);
		sut = new CreateUserService(userRepo, crypt);
	});

	it('should be able to create a user', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const member = condominiumMemberFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		const communityInfos = communityInfosFactory({
			memberId: member.id.value,
		});

		await memberRepo.createMany({
			members: [
				{
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
		await sut.exec({ user, uniqueRegistry });
		expect(userRepo.calls.create).toEqual(1);
	});
});
