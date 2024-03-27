import { InMemoryEmployeeMembersReadOps } from '.';
import { InMemoryContainer } from '../../inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { CondominiumMemberMapper } from '@app/mapper/condominiumMember';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('InMemoryData test: Employee Member getByUserId method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryEmployeeMembersReadOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryEmployeeMembersReadOps(container);
	});

	it('should be able to find one member', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		const member = condominiumMemberFactory({
			userId: user.id.value,
			uniqueRegistryId: uniqueRegistry.id.value,
			role: 1,
		});
		sut.uniqueRegistries.push(uniqueRegistry);
		sut.condominiumMembers.push(member);
		sut.users.push(user);

		const searchedMember = await sut.getByUserId({ id: user.id });
		expect(
			CondominiumMemberMapper.toClass(searchedMember!.worksOn[0]).equalTo(
				member,
			),
		);
		expect(sut.calls.getByUserId).toEqual(1);
	});
});
