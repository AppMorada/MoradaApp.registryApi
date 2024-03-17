import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryEmployeeMembers } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { UUID } from '@app/entities/VO';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { condominiumFactory } from '@tests/factories/condominium';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('InMemoryData test: Employee Member create method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryEmployeeMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryEmployeeMembers(container);
	});

	it('should be able to create one member', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			CPF: undefined,
		});
		const condominiumOwner = userFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		const condominium = condominiumFactory({
			ownerId: condominiumOwner.id.value,
		});
		sut.uniqueRegistries.push(uniqueRegistry);
		sut.users.push(condominiumOwner);
		sut.condominiums.push(condominium);

		const user = userFactory();
		const member = condominiumMemberFactory({
			userId: user.id.value,
			role: 1,
			condominiumId: condominium.id.value,
		});
		sut.condominiumMembers.push(member);
		sut.users.push(user);

		expect(sut.remove({ userId: user.id, condominiumId: condominium.id }))
			.resolves;
		expect(sut.calls.remove).toEqual(1);
	});

	it('should be able to throw one error: member already exist', async () => {
		await expect(
			sut.remove({
				userId: UUID.genV4(),
				condominiumId: UUID.genV4(),
			}),
		).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'Employee member doesn\'t exist',
			}),
		);

		expect(sut.calls.remove).toEqual(1);
	});
});
