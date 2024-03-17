import { GetEmployeeMemberGroupByCondominiumIdService } from '@app/services/members/employee/getByGroupByCondominiumId.service';
import { condominiumFactory } from '@tests/factories/condominium';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { userFactory } from '@tests/factories/user';
import { InMemoryEmployeeMembers } from '@tests/inMemoryDatabase/employeeMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Get employee member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryEmployeeMembers;

	let sut: GetEmployeeMemberGroupByCondominiumIdService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryEmployeeMembers(container);

		sut = new GetEmployeeMemberGroupByCondominiumIdService(memberRepo);
	});

	it('should be able to get a member', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const condominium = condominiumFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const member = condominiumMemberFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
			userId: user.id.value,
			condominiumId: condominium.id.value,
		});
		memberRepo.create({
			user,
			member,
			rawUniqueRegistry: {
				email: uniqueRegistry.email,
				CPF: uniqueRegistry.CPF!,
			},
		});

		await sut.exec({ id: member.id.value });
		expect(memberRepo.calls.getGroupCondominiumId === 1).toEqual(true);
	});
});
