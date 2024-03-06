import { GetCondominiumMemberGroupByCondominiumIdService } from '@app/services/members/condominium/getByGroupByCondominiumId.service';
import { condominiumFactory } from '@tests/factories/condominium';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { userFactory } from '@tests/factories/user';
import { InMemoryCondominiumMembers } from '@tests/inMemoryDatabase/condominiumMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Get condominium member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryCondominiumMembers;

	let sut: GetCondominiumMemberGroupByCondominiumIdService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryCondominiumMembers(container);

		sut = new GetCondominiumMemberGroupByCondominiumIdService(memberRepo);
	});

	it('should be able to get a member', async () => {
		const condominium = condominiumFactory();
		const user = userFactory();
		const member = condominiumMemberFactory({
			userId: user.id.value,
			condominiumId: condominium.id.value,
		});
		memberRepo.condominiumMembers.push(member);

		await sut.exec({ id: member.id.value });
		expect(memberRepo.calls.getGroupCondominiumId === 1).toEqual(true);
	});
});
