import { CreateUserService } from '../../user/create.service';
import { userFactory } from '@tests/factories/user';
import { CryptSpy } from '@tests/adapters/cryptSpy';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { InMemoryUserCreate } from '@tests/inMemoryDatabase/user/write/create';

describe('Create user test', () => {
	let sut: CreateUserService;
	let createUserRepo: InMemoryUserCreate;
	let crypt: CryptSpy;

	beforeEach(() => {
		crypt = new CryptSpy();
		createUserRepo = new InMemoryUserCreate();
		sut = new CreateUserService(createUserRepo, crypt);
	});

	it('should be able to create a user', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });

		await sut.exec({ user, uniqueRegistry });

		expect(crypt.calls.hash).toEqual(1);
		expect(createUserRepo.calls.exec).toEqual(1);
	});
});
