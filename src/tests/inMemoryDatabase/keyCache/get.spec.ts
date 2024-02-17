import { InMemoryKeyCache } from '.';
import { InMemoryContainer } from '../inMemoryContainer';
import { keyFactory } from '@tests/factories/key';
import { KeysEnum } from '@app/repositories/key';

describe('InMemoryKeyCache get method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryKeyCache;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryKeyCache(container);
	});

	it('should be able to get some key', async () => {
		const key = keyFactory({
			name: KeysEnum.ACCESS_TOKEN_KEY,
		});
		sut.keys.push(key);

		const searchedKey = await sut.get(KeysEnum.ACCESS_TOKEN_KEY);
		expect(searchedKey?.equalTo(key));
		expect(sut.calls.get).toEqual(1);
	});
});
