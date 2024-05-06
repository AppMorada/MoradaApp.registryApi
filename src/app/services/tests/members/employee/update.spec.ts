import { UUID } from '@app/entities/VO';
import { UpdateEmployeeMemberService } from '@app/services/members/employee/updateMember.service';
import { InMemoryEmployeeMembersUpdate } from '@tests/inMemoryDatabase/employeeMember/write/update';

describe('Update employee member by user id', () => {
	let updateMemberRepo: InMemoryEmployeeMembersUpdate;
	let sut: UpdateEmployeeMemberService;

	beforeEach(() => {
		updateMemberRepo = new InMemoryEmployeeMembersUpdate();
		sut = new UpdateEmployeeMemberService(updateMemberRepo);
	});

	it('should be able to update a member', async () => {
		await sut.exec({
			userId: UUID.genV4().value,
			condominiumId: UUID.genV4().value,
			name: 'new name',
		});
		expect(updateMemberRepo.calls.exec).toEqual(1);
	});
});
