import { UUID } from '@app/entities/VO';
import { RemoveEmployeeMemberService } from '@app/services/members/employee/removeMember.service';
import { InMemoryEmployeeMembersRemove } from '@tests/inMemoryDatabase/employeeMember/write/delete';

describe('Get employee member by user id', () => {
	let removeMemberRepo: InMemoryEmployeeMembersRemove;

	let sut: RemoveEmployeeMemberService;

	beforeEach(() => {
		removeMemberRepo = new InMemoryEmployeeMembersRemove();
		sut = new RemoveEmployeeMemberService(removeMemberRepo);
	});

	it('should be able to get a member', async () => {
		await sut.exec({
			userId: UUID.genV4().value,
			condominiumId: UUID.genV4().value,
		});
		expect(removeMemberRepo.calls.exec).toEqual(1);
	});
});
