import { GetEmployeeMemberGroupByCondominiumIdService } from '@app/services/members/employee/getByGroupByCondominiumId.service';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { InMemoryEmployeeMembersGetGroupByCondominiumId } from '@tests/inMemoryDatabase/employeeMember/read/getGroupCondominiumId';

describe('Get employee member by user id', () => {
	let getMemberRepo: InMemoryEmployeeMembersGetGroupByCondominiumId;

	let sut: GetEmployeeMemberGroupByCondominiumIdService;

	beforeEach(() => {
		getMemberRepo = new InMemoryEmployeeMembersGetGroupByCondominiumId();
		sut = new GetEmployeeMemberGroupByCondominiumIdService(getMemberRepo);
	});

	it('should be able to get a member', async () => {
		const member = condominiumMemberFactory();

		await sut.exec({ id: member.id.value });
		expect(getMemberRepo.calls.exec).toEqual(1);
	});
});
