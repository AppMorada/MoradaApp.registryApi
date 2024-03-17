import { RemoveEmployeeMemberService } from '@app/services/members/employee/removeMember.service';
import { condominiumFactory } from '@tests/factories/condominium';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { userFactory } from '@tests/factories/user';
import { InMemoryCondominium } from '@tests/inMemoryDatabase/condominium';
import { InMemoryEmployeeMembers } from '@tests/inMemoryDatabase/employeeMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Get employee member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryEmployeeMembers;
	let condominiumRepo: InMemoryCondominium;

	let sut: RemoveEmployeeMemberService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryEmployeeMembers(container);
		condominiumRepo = new InMemoryCondominium(container);

		sut = new RemoveEmployeeMemberService(memberRepo);
	});

	it('should be able to get a member', async () => {
		const uniqueRegistryOwner = uniqueRegistryFactory({
			email: 'owner@email.com',
		});
		const condominiumOwner = userFactory({
			uniqueRegistryId: uniqueRegistryOwner.id.value,
		});
		const condominium = condominiumFactory({
			ownerId: condominiumOwner.id.value,
		});
		await condominiumRepo.create({
			condominium,
			user: condominiumOwner,
			uniqueRegistry: uniqueRegistryOwner,
		});

		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const member = condominiumMemberFactory({
			userId: user.id.value,
			condominiumId: condominium.id.value,
			role: 1,
		});
		await memberRepo.create({
			user,
			member,
			rawUniqueRegistry: {
				email: uniqueRegistry.email,
				CPF: uniqueRegistry.CPF!,
			},
		});

		await sut.exec({
			userId: user.id.value,
			condominiumId: condominium.id.value,
		});
		expect(memberRepo.calls.remove === 1).toEqual(true);
		expect(memberRepo.users.length === 1).toEqual(true);
	});
});
