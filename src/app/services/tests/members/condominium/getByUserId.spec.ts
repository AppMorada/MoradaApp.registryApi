import { GetCondominiumMemberByUserIdService } from '@app/services/members/condominium/getByUserId.service';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { userFactory } from '@tests/factories/user';
import { InMemoryCondominiumMembers } from '@tests/inMemoryDatabase/condominiumMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Get condominium member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryCondominiumMembers;

	let sut: GetCondominiumMemberByUserIdService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryCondominiumMembers(container);

		sut = new GetCondominiumMemberByUserIdService(memberRepo);
	});

	it('should be able to get a member', async () => {
		const user = userFactory();
		const member = condominiumMemberFactory({ userId: user.id.value });
		memberRepo.condominiumMembers.push(member);

		await sut.exec({ id: member.id.value });
		expect(memberRepo.calls.getByUserId === 1).toEqual(true);
	});
});
