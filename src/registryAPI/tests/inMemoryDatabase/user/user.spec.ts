import { InMemoryError } from '@registry:tests/errors/inMemoryError';
import { InMemoryUser } from '.';
import { userFactory } from '@registry:tests/factories/user';
import { EntitiesEnum } from '@registry:app/entities/entities';

describe('InMemoryData test: User', () => {
	let sut: InMemoryUser;

	beforeEach(() => (sut = new InMemoryUser()));

	it('should be able to create one user', async () => {
		const user = userFactory();
		expect(sut.create({ user })).resolves;
	});

	it('should be able to delete one user', async () => {
		const user = userFactory();

		await sut.create({ user });
		await sut.delete({ id: user.id });

		await sut.create({ user });
		await sut.delete({ email: user.email });

		expect(Boolean(sut.users[0])).toBeFalsy();
	});

	it('should be able to throw one error: user does not exist - delete operation', async () => {
		const user = userFactory();
		await expect(sut.delete({ id: user.id })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User doesn\'t exist',
			}),
		);
	});

	it('should be able to throw one error: user already exist', async () => {
		const user = userFactory();
		expect(sut.create({ user })).resolves;
		await expect(sut.create({ user })).rejects.toThrow(
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
