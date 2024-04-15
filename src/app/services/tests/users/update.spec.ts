import { InMemoryUserWriteOps } from '@tests/inMemoryDatabase/user/write';
import { userFactory } from '@tests/factories/user';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { UpdateUserService } from '@app/services/user/update.service';
import { CryptSpy } from '@tests/adapters/cryptSpy';

describe('Update user test', () => {
	let sut: UpdateUserService;

	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUserWriteOps;
	let cryptSpy: CryptSpy;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUserWriteOps(inMemoryContainer);
		cryptSpy = new CryptSpy();
		sut = new UpdateUserService(userRepo, cryptSpy);
	});

	it('should be able to update a user', async () => {
		const user = userFactory();

		userRepo.users.push(user);
		await sut.exec({
			id: user.id.value,
			name: 'new name',
			password: 'new password',
		});

		expect(userRepo.users[0].name.value === 'new name').toBe(true);
		expect(userRepo.users[0].password.value === 'new password').toBe(true);
		expect(userRepo.calls.update).toEqual(1);
		expect(cryptSpy.calls.hash).toEqual(1);
	});
});
