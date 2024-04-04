import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryUserWriteOps } from '.';
import { userFactory } from '@tests/factories/user';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../../inMemoryContainer';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('InMemoryData test: User create method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryUserWriteOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryUserWriteOps(container);
	});

	it('should be able to create one user', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});

		await sut.create({ user, uniqueRegistry });

		expect(Boolean(sut.users[1])).toBeFalsy();
		expect(sut.calls.create).toEqual(1);
	});

	it('should be able to throw one error: user already exist - create operation', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		await sut.create({ user, uniqueRegistry });

		await expect(sut.create({ user, uniqueRegistry })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User already exist',
			}),
		);

		expect(sut.calls.create).toEqual(2);
	});
});
