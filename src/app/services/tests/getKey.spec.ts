import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { GetKeyService } from '../getKey.service';
import { keyFactory } from '@tests/factories/key';
import { KeysEnum } from '@app/repositories/key';

describe('Get Key test', () => {
	let container: InMemoryContainer;
	let keyRepo: InMemoryKey;
	let getKeyService: GetKeyService;

	beforeEach(() => {
		container = new InMemoryContainer();
		keyRepo = new InMemoryKey(container);

		getKeyService = new GetKeyService(keyRepo);
	});

	it('should be able to get a signature', async () => {
		const key = keyFactory({
			name: KeysEnum.ACCESS_TOKEN_KEY,
		});
		await keyRepo.create(key);

		const { key: searchedKey } = await getKeyService.exec({
			name: KeysEnum.ACCESS_TOKEN_KEY,
		});
		expect(searchedKey === key).toEqual(true);
		expect(keyRepo.calls.getSignature).toEqual(1);
	});
});
