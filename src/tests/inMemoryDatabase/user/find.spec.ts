import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryUser } from '.';
import { userFactory } from '@tests/factories/user';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';

describe('InMemoryData test: User find method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryUser;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryUser(container);
	});

	it('should be able to find one user', async () => {
		const user = userFactory();

		sut.users.push(user);

		const sut2 = await sut.find({ key: user.email });
		const sut3 = await sut.find({ key: user.id });

		expect(sut2 && sut3 && sut2.equalTo(sut3)).toBeTruthy();
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
