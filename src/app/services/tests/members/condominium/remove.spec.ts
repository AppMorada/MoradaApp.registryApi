import { RemoveCondominiumMemberService } from '@app/services/members/condominium/removeMember.service';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { userFactory } from '@tests/factories/user';
import { InMemoryCondominiumMembers } from '@tests/inMemoryDatabase/condominiumMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Get condominium member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryCondominiumMembers;

	let sut: RemoveCondominiumMemberService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryCondominiumMembers(container);

		sut = new RemoveCondominiumMemberService(memberRepo);
	});

	it('should be able to get a member', async () => {
		const user = userFactory();
		const member = condominiumMemberFactory({ userId: user.id.value });
		memberRepo.condominiumMembers.push(member);

		await sut.exec({ id: member.id.value });
		expect(memberRepo.calls.remove === 1).toEqual(true);
	});
});
