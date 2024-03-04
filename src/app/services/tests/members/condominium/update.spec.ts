import { UpdateCondominiumMemberService } from '@app/services/members/condominium/updateMember.service';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { userFactory } from '@tests/factories/user';
import { InMemoryCondominiumMembers } from '@tests/inMemoryDatabase/condominiumMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Update condominium member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryCondominiumMembers;

	let sut: UpdateCondominiumMemberService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryCondominiumMembers(container);

		sut = new UpdateCondominiumMemberService(memberRepo);
	});

	it('should be able to update a member', async () => {
		const user = userFactory();
		const member = condominiumMemberFactory({ userId: user.id.value });
		memberRepo.condominiumMembers.push(member);

		await sut.exec({
			id: member.id.value,
			c_email: 'newemail@email.com',
		});
		expect(memberRepo.calls.update === 1).toEqual(true);
		expect(memberRepo.condominiumMembers[0].c_email.value).toEqual(
			'newemail@email.com',
		);
	});
});
