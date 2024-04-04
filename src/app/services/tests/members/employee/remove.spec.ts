import { RemoveEmployeeMemberService } from '@app/services/members/employee/removeMember.service';
import { condominiumFactory } from '@tests/factories/condominium';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { userFactory } from '@tests/factories/user';
import { InMemoryCondominiumWriteOps } from '@tests/inMemoryDatabase/condominium/write';
import { InMemoryEmployeeMembersWriteOps } from '@tests/inMemoryDatabase/employeeMember/write';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Get employee member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryEmployeeMembersWriteOps;
	let condominiumRepo: InMemoryCondominiumWriteOps;

	let sut: RemoveEmployeeMemberService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryEmployeeMembersWriteOps(container);
		condominiumRepo = new InMemoryCondominiumWriteOps(container);

		sut = new RemoveEmployeeMemberService(memberRepo);
	});

	it('should be able to get a member', async () => {
		const condominium = condominiumFactory();
		await condominiumRepo.create({ condominium });

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
		expect(memberRepo.users.length === 0).toEqual(true);
	});
});
