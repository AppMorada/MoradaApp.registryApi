import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryUser } from '.';
import { userFactory } from '@tests/factories/user';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';
import { Name } from '@app/entities/VO';

describe('InMemoryData test: User update method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryUser;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryUser(container);
	});

	it('should be able to update one user', async () => {
		const user = userFactory();

		sut.users.push(user);
		await sut.update({
			id: user.id,
			name: new Name('New name'),
		});

		const searchedUser = sut.users[0];
		expect(searchedUser.name.value === 'New name').toEqual(true);
		expect(sut.calls.update).toEqual(1);
	});

	it('should be able to throw one error: user does not exist - update operation', async () => {
		const user = userFactory();
		await expect(sut.update({ id: user.id })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User doesn\'t exist',
			}),
		);

		expect(sut.calls.update).toEqual(1);
	});
});
