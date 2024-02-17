import { InMemoryKeyCache } from '.';
import { InMemoryContainer } from '../inMemoryContainer';
import { keyFactory } from '@tests/factories/key';
import { KeysEnum } from '@app/repositories/key';

describe('InMemoryKeyCache add method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryKeyCache;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryKeyCache(container);
	});

	it('should be able to add some key', async () => {
		const key = keyFactory({
			name: KeysEnum.ACCESS_TOKEN_KEY,
		});

		await sut.set(key);
		expect(sut.keys[0].equalTo(key)).toEqual(true);

		const newKey = keyFactory({
			name: KeysEnum.ACCESS_TOKEN_KEY,
			actual: {
				content: 'new content',
				buildedAt: Date.now(),
			},
		});
		await sut.set(newKey);
		expect(sut.keys[0].equalTo(key)).toEqual(false);

		expect(sut.calls.set).toEqual(2);
	});
});
