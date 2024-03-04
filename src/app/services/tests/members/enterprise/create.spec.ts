import { CreateEnterpriseUserService } from '@app/services/members/enterprise/create.service';
import { CryptSpy } from '@tests/adapters/cryptSpy';
import { enterpriseMemberFactory } from '@tests/factories/enterpriseMember';
import { userFactory } from '@tests/factories/user';
import { InMemoryEnterpriseMembers } from '@tests/inMemoryDatabase/enterpriseMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Get enteprise member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryEnterpriseMembers;

	let crypyAdapter: CryptSpy;

	let sut: CreateEnterpriseUserService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryEnterpriseMembers(container);
		crypyAdapter = new CryptSpy();

		sut = new CreateEnterpriseUserService(crypyAdapter, memberRepo);
	});

	it('should be able to get a member', async () => {
		const user = userFactory();
		const member = enterpriseMemberFactory({ userId: user.id.value });

		await sut.exec({
			condominiumId: member.condominiumId.value,
			hierarchy: member.hierarchy.value,
			user,
		});
		expect(memberRepo.calls.create === 1).toEqual(true);
		expect(memberRepo.users[0].equalTo(user)).toBe(true);
		expect(crypyAdapter.calls.hash === 1).toEqual(true);
	});
});
