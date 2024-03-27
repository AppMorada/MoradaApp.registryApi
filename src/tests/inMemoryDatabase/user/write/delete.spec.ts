import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryUserWriteOps } from '.';
import { userFactory } from '@tests/factories/user';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../../inMemoryContainer';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('InMemoryData test: User delete method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryUserWriteOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryUserWriteOps(container);
	});

	it('should be able to delete one user', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});

		sut.uniqueRegistries.push(uniqueRegistry);
		sut.users.push(user);
		await sut.delete({ key: user.id });

		expect(Boolean(sut.users[0])).toBeFalsy();
		expect(sut.calls.delete).toEqual(1);
	});

	it('should be able to throw one error: user does not exist - delete operation', async () => {
		const user = userFactory();
		await expect(sut.delete({ key: user.id })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User doesn\'t exist',
			}),
		);

		expect(sut.calls.delete).toEqual(1);
	});
});
