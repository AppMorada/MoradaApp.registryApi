import { UUID } from '@app/entities/VO';
import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';
import { EmployeeMemberRepoReadOpsInterfaces } from '@app/repositories/employeeMember/read';
import { RemoveEmployeeMemberService } from '@app/services/members/employee/removeMember.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { userFactory } from '@tests/factories/user';
import { InMemoryEmployeeMembersGetByUserId } from '@tests/inMemoryDatabase/employeeMember/read/getByUserId';
import { InMemoryEmployeeMembersRemove } from '@tests/inMemoryDatabase/employeeMember/write/delete';

describe('Remove employee member by user id', () => {
	let removeMemberRepo: InMemoryEmployeeMembersRemove;
	let memberRepoGet: InMemoryEmployeeMembersGetByUserId;
	let eventEmitter: EventEmitter2;

	let sut: RemoveEmployeeMemberService;

	beforeEach(() => {
		removeMemberRepo = new InMemoryEmployeeMembersRemove();
		memberRepoGet = new InMemoryEmployeeMembersGetByUserId();
		eventEmitter = new EventEmitter2();
		sut = new RemoveEmployeeMemberService(
			removeMemberRepo,
			memberRepoGet,
			eventEmitter,
		);
	});

	it('should be able to remove a member', async () => {
		EventEmitter2.prototype.emit = jest.fn(() => true);

		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory();
		const performantUser: EmployeeMemberRepoReadOpsInterfaces.performantUser =
			{
				id: user.id.value,
				name: user.name.value,
				phoneNumber: user.phoneNumber?.value,
				tfa: user.tfa,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			};
		InMemoryEmployeeMembersGetByUserId.prototype.exec = jest.fn(
			async () => {
				++memberRepoGet.calls.exec;
				return {
					worksOn: [],
					uniqueRegistry:
						UniqueRegistryMapper.toObject(uniqueRegistry),
					user: performantUser,
				};
			},
		);

		await sut.exec({
			userId: user.id.value,
			condominiumId: UUID.genV4().value,
		});
		expect(removeMemberRepo.calls.exec).toEqual(1);
		expect(memberRepoGet.calls.exec).toEqual(1);
	});
});
