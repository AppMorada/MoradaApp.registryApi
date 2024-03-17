import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryUser } from '.';
import { userFactory } from '@tests/factories/user';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('InMemoryData test: User find method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryUser;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryUser(container);
	});

	it('should be able to find one user', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});

		sut.uniqueRegistries.push(uniqueRegistry);
		sut.users.push(user);

		const searchedUserContentById = await sut.find({ key: user.id });
		const searchedUserContentByEmail = await sut.find({
			key: uniqueRegistry.email,
		});

		expect(
			searchedUserContentById.uniqueRegistry.equalTo(uniqueRegistry),
		).toEqual(true);
		expect(searchedUserContentById.user.equalTo(user)).toEqual(true);

		expect(
			searchedUserContentByEmail.uniqueRegistry.equalTo(uniqueRegistry),
		).toEqual(true);
		expect(searchedUserContentByEmail.user.equalTo(user)).toEqual(true);

		expect(sut.calls.find).toEqual(2);
	});

	it('should be able to throw one error: User doesn\'t exists', async () => {
		const user = userFactory();

		await expect(
			sut.find({ key: user.id, safeSearch: true }),
		).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User not found',
			}),
		);

		expect(sut.calls.find).toEqual(1);
	});
});
