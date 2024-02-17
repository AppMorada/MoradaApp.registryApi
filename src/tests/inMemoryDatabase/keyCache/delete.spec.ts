import { InMemoryKeyCache } from '.';
import { InMemoryContainer } from '../inMemoryContainer';
import { keyFactory } from '@tests/factories/key';
import { KeysEnum } from '@app/repositories/key';

describe('InMemoryKeyCache delete method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryKeyCache;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryKeyCache(container);
	});

	it('should be able to delete some key', async () => {
		const key = keyFactory({
			name: KeysEnum.ACCESS_TOKEN_KEY,
		});
		sut.keys.push(key);

		await sut.delete(KeysEnum.ACCESS_TOKEN_KEY);
		expect(sut.keys.length).toEqual(0);
		expect(sut.calls.delete).toEqual(1);
	});
});
