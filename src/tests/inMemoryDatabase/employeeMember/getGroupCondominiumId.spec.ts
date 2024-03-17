import { InMemoryEmployeeMembers } from '.';
import { InMemoryContainer } from '../inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { UserMapper } from '@app/mapper/user';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('InMemoryData test: Employee Member getGroupCondominiumId method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryEmployeeMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryEmployeeMembers(container);
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

		const searchedMember = await sut.getGroupCondominiumId({
			condominiumId: member.condominiumId,
		});
		expect(
			UserMapper.toClass({
				...searchedMember[0].user,
				password: user.password.value,
				tfa: user.tfa,
			}).equalTo(user),
		);
		expect(sut.calls.getGroupCondominiumId).toEqual(1);
	});
});
