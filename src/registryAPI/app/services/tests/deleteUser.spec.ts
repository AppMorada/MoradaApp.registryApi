import { InMemoryUser } from '@registry:tests/inMemoryDatabase/user';
import { userFactory } from '@registry:tests/factories/user';
import { DeleteUserService } from '../deleteUser.service';
import { InMemoryContainer } from '@registry:tests/inMemoryDatabase/inMemoryContainer';
import { condominiumRelUserFactory } from '@registry:tests/factories/condominiumRelUser';
import { Email } from '@registry:app/entities/VO';
import {
	ServiceErrors,
	ServiceErrorsTags,
} from '@registry:app/errors/services';

describe('Delete user test', () => {
	let deleteUser: DeleteUserService;

	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUser;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUser(inMemoryContainer);
		deleteUser = new DeleteUserService(userRepo);
	});

	it('should be able to delete a user', async () => {
		const actualUser = new Email('actualUserEmail@myemail.com');

		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();

		await userRepo.create({ user, condominiumRelUser });
		await deleteUser.exec({ target: user.email, actualUser });

		expect(Boolean(userRepo.users[0])).toBeFalsy();
		expect(userRepo.calls.delete).toEqual(1);
	});

	it('should be able to throw one error - cannot user admin resource to delete itself', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();

		await userRepo.create({ user, condominiumRelUser });
		await expect(
			deleteUser.exec({
				target: user.email,
				actualUser: user.email,
			}),
		).rejects.toThrow(
			new ServiceErrors({
				message:
					'Não é possível deletar você mesmo utilizando os recursos de administradores',
				tag: ServiceErrorsTags.wrongServiceUsage,
			}),
		);
	});
});
