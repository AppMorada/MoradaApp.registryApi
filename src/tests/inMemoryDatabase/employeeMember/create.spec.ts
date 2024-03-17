import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryEmployeeMembers } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('InMemoryData test: Employee Member create method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryEmployeeMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryEmployeeMembers(container);
	});

	it('should be able to create one member', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		const member = condominiumMemberFactory({
			userId: user.id.value,
			uniqueRegistryId: uniqueRegistry.id.value,
		});

		expect(
			sut.create({
				member,
				user,
				rawUniqueRegistry: {
					CPF: uniqueRegistry.CPF!,
					email: uniqueRegistry.email,
				},
			}),
		).resolves;
		expect(sut.calls.create).toEqual(1);
	});

	it('should be able to throw one error: member already exist', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		const member = condominiumMemberFactory({
			userId: user.id.value,
			uniqueRegistryId: uniqueRegistry.id.value,
		});

		expect(
			sut.create({
				member,
				user,
				rawUniqueRegistry: {
					CPF: uniqueRegistry.CPF!,
					email: uniqueRegistry.email,
				},
			}),
		).resolves;
		await expect(
			sut.create({
				member,
				user,
				rawUniqueRegistry: {
					email: uniqueRegistry.email,
					CPF: uniqueRegistry.CPF!,
				},
			}),
		).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'Employee member already exist',
			}),
		);

		expect(sut.calls.create).toEqual(2);
	});
});
