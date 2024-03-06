import { GetEnterpriseMemberGroupByCondominiumIdService } from '@app/services/members/enterprise/getByGroupByCondominiumId.service';
import { condominiumFactory } from '@tests/factories/condominium';
import { enterpriseMemberFactory } from '@tests/factories/enterpriseMember';
import { userFactory } from '@tests/factories/user';
import { InMemoryEnterpriseMembers } from '@tests/inMemoryDatabase/enterpriseMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Get enteprise member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryEnterpriseMembers;

	let sut: GetEnterpriseMemberGroupByCondominiumIdService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryEnterpriseMembers(container);

		sut = new GetEnterpriseMemberGroupByCondominiumIdService(memberRepo);
	});

	it('should be able to get a member', async () => {
		const condominium = condominiumFactory();
		const user = userFactory();
		const member = enterpriseMemberFactory({
			userId: user.id.value,
			condominiumId: condominium.id.value,
		});
		memberRepo.enterpriseMembers.push(member);

		await sut.exec({ id: member.id.value });
		expect(memberRepo.calls.getGroupCondominiumId === 1).toEqual(true);
	});
});
