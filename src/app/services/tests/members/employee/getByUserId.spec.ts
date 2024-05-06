import { GetEmployeeMemberByUserIdService } from '@app/services/members/employee/getByUserId.service';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { InMemoryEmployeeMembersGetByUserId } from '@tests/inMemoryDatabase/employeeMember/read/getByUserId';

describe('Get employee member by user id', () => {
	let getMemberRepo: InMemoryEmployeeMembersGetByUserId;

	let sut: GetEmployeeMemberByUserIdService;

	beforeEach(() => {
		getMemberRepo = new InMemoryEmployeeMembersGetByUserId();
		sut = new GetEmployeeMemberByUserIdService(getMemberRepo);
	});

	it('should be able to get a member', async () => {
		const member = condominiumMemberFactory();

		await sut.exec({ id: member.id.value });
		expect(getMemberRepo.calls.exec).toEqual(1);
	});
});
