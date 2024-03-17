import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryEmployeeMembers } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';
import { Name, PhoneNumber, UUID } from '@app/entities/VO';
import { userFactory } from '@tests/factories/user';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { condominiumFactory } from '@tests/factories/condominium';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('InMemoryData test: Employee Member update method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryEmployeeMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryEmployeeMembers(container);
	});

	it('should be able to update one member', async () => {
		const uniqueRegistryForOwner = uniqueRegistryFactory({
			CPF: undefined,
		});
		const condominiumOwner = userFactory({
			uniqueRegistryId: uniqueRegistryForOwner.id.value,
		});
		const condominium = condominiumFactory({
			ownerId: condominiumOwner.id.value,
		});
		sut.uniqueRegistries.push(uniqueRegistryForOwner);
		sut.users.push(condominiumOwner);
		sut.condominiums.push(condominium);

		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user1@email.com',
			CPF: '881.218.723-40',
		});
		const user = userFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		const member = condominiumMemberFactory({
			userId: user.id.value,
			uniqueRegistryId: uniqueRegistry.id.value,
			role: 1,
			condominiumId: condominium.id.value,
		});
		sut.uniqueRegistries.push(uniqueRegistry);
		sut.condominiumMembers.push(member);
		sut.users.push(user);

		expect(
			sut.update({
				userId: user.id,
				condominiumId: condominium.id,
				phoneNumber: new PhoneNumber('2154659887'),
				name: new Name('new name'),
			}),
		).resolves;

		const searchedUser = sut.users?.[1];
		expect(searchedUser?.phoneNumber?.value).toEqual('2154659887');
		expect(searchedUser?.name?.value).toEqual('new name');
		expect(sut.calls.update).toEqual(1);
	});

	it('should be able to throw one error: member already exist', async () => {
		const userId = UUID.genV4();
		const condominiumId = UUID.genV4();

		await expect(sut.update({ userId, condominiumId })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'Employee member doesn\'t exist',
			}),
		);

		expect(sut.calls.update).toEqual(1);
	});
});
