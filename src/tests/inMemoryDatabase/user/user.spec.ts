import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryUser } from '.';
import { userFactory } from '@tests/factories/user';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';
import { condominiumRelUserFactory } from '@tests/factories/condominiumRelUser';

describe('InMemoryData test: User', () => {
	let container: InMemoryContainer;
	let sut: InMemoryUser;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryUser(container);
	});

	it('should be able to create one user', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();

		expect(sut.create({ user, condominiumRelUser })).resolves;
		expect(sut.calls.create).toEqual(1);
	});

	it('should be able to get condominiumRelUser', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();

		sut.users.push({
			user: {
				content: user,
				condominiumRelUser: {
					[condominiumRelUser.condominiumId.value]:
						condominiumRelUser,
				},
			},
		});

		const singleCondominiumRelUser = await sut.getCondominiumRelation({
			userId: user.id,
			condominiumId: condominiumRelUser.condominiumId,
		});

		const allCondominiumRelUser = await sut.getAllCondominiumRelation({
			userId: user.id,
		});

		expect(singleCondominiumRelUser).toBeTruthy();
		expect(allCondominiumRelUser.length).toEqual(1);

		expect(sut.calls.getCondominiumRelation).toEqual(1);
		expect(sut.calls.getAllCondominiumRelation).toEqual(1);
	});

	it('should be able to delete one user', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();

		await sut.create({ user, condominiumRelUser });
		await sut.delete({ key: user.id });

		await sut.create({ user, condominiumRelUser });
		await sut.delete({ key: user.email });

		expect(Boolean(sut.users[0])).toBeFalsy();
		expect(sut.calls.create).toEqual(2);
		expect(sut.calls.delete).toEqual(2);
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

	it('should be able to throw one error: user already exist', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();

		expect(sut.create({ user, condominiumRelUser })).resolves;
		await expect(sut.create({ user, condominiumRelUser })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User already exist',
			}),
		);

		expect(sut.calls.create).toEqual(2);
	});

	it('should be able to find one user', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();

		sut.users.push({
			user: {
				content: user,
				condominiumRelUser: {
					[condominiumRelUser.condominiumId.value]:
						condominiumRelUser,
				},
			},
		});

		const sut2 = await sut.find({ key: user.email });
		const sut3 = await sut.find({ key: user.CPF });
		const sut4 = await sut.find({ key: user.id });

		expect(sut2 && sut3 && sut2.equalTo(sut3)).toBeTruthy();
		expect(sut3 && sut4 && sut3.equalTo(sut4)).toBeTruthy();

		expect(sut.calls.find).toEqual(3);
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
