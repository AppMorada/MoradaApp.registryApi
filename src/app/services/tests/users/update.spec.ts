import { userFactory } from '@tests/factories/user';
import { UpdateUserService } from '@app/services/user/update.service';
import { CryptSpy } from '@tests/adapters/cryptSpy';
import { InMemoryUserUpdate } from '@tests/inMemoryDatabase/user/write/update';

describe('Update user test', () => {
	let sut: UpdateUserService;

	let updateUserRepo: InMemoryUserUpdate;
	let cryptSpy: CryptSpy;

	beforeEach(() => {
		updateUserRepo = new InMemoryUserUpdate();
		cryptSpy = new CryptSpy();
		sut = new UpdateUserService(updateUserRepo, cryptSpy);
	});

	it('should be able to update a user', async () => {
		const user = userFactory();

		await sut.exec({
			id: user.id.value,
			name: 'new name',
			password: 'new password',
		});

		expect(updateUserRepo.calls.exec).toEqual(1);
		expect(cryptSpy.calls.hash).toEqual(1);
	});
});
