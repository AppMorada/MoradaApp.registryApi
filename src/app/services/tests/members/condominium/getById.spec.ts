import { GetCondominiumMemberByIdService } from '@app/services/members/condominium/getById.service';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { InMemoryCondominiumMembers } from '@tests/inMemoryDatabase/condominiumMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUser } from '@tests/inMemoryDatabase/user';

describe('Get condominium member by id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryCondominiumMembers;
	let userRepo: InMemoryUser;

	let sut: GetCondominiumMemberByIdService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryCondominiumMembers(container);
		userRepo = new InMemoryUser(container);

		sut = new GetCondominiumMemberByIdService(memberRepo, userRepo);
	});

	it('should be able to get a member', async () => {
		const member = condominiumMemberFactory();
		memberRepo.condominiumMembers.push(member);

		await sut.exec({ id: member.id.value });
		expect(memberRepo.calls.getById === 1).toEqual(true);
	});
});
