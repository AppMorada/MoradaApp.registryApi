import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryUser } from '.';
import { userFactory } from '@tests/factories/user';
import { EntitiesEnum } from '@app/entities/entities';

describe('InMemoryData test: User', () => {
	let sut: InMemoryUser;

	beforeEach(() => (sut = new InMemoryUser()));

	it('should be able to create one user', async () => {
		const user = userFactory();
		expect(sut.create({ user })).resolves;
	});

	it('should be able to throw one error: user already exist', async () => {
		const user = userFactory();
		expect(sut.create({ user })).resolves;
		await expect(sut.create({ user })).rejects.toThrowError(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User already exist',
			}),
		);
	});

	it('should be able to find one user', async () => {
		const user = userFactory();
		sut.users.push(user);

		const sut2 = await sut.find({
			email: user.email,
		});
		const sut3 = await sut.find({
			CPF: user.CPF,
		});
		const sut4 = await sut.find({
			id: user.id,
		});

		expect(sut2 && sut3 && sut2.equalTo(sut3)).toBeTruthy();
		expect(sut3 && sut4 && sut3.equalTo(sut4)).toBeTruthy();
	});
});
