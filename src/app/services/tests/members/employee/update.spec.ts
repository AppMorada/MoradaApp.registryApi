import { UpdateEmployeeMemberService } from '@app/services/members/employee/updateMember.service';
import { condominiumFactory } from '@tests/factories/condominium';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { userFactory } from '@tests/factories/user';
import { InMemoryCondominiumWriteOps } from '@tests/inMemoryDatabase/condominium/write';
import { InMemoryEmployeeMembersWriteOps } from '@tests/inMemoryDatabase/employeeMember/write';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Update employee member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryEmployeeMembersWriteOps;
	let condominiumRepo: InMemoryCondominiumWriteOps;

	let sut: UpdateEmployeeMemberService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryEmployeeMembersWriteOps(container);
		condominiumRepo = new InMemoryCondominiumWriteOps(container);

		sut = new UpdateEmployeeMemberService(memberRepo);
	});

	it('should be able to update a member', async () => {
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
			name: 'new name',
		});
		expect(memberRepo.calls.update === 1).toEqual(true);
		expect(memberRepo.users[0].name.value).toEqual('new name');
	});
});
