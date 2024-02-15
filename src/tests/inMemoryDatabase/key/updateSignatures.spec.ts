import { keyFactory } from '@tests/factories/key';
import { InMemoryKey } from '.';
import { InMemoryContainer } from '../inMemoryContainer';
import { randomBytes } from 'crypto';

describe('InMemoryKeyRepo updateSignatures method test', () => {
	let sut: InMemoryKey;
	let container: InMemoryContainer;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryKey(container);
	});

	it('should be able to update the signatures', async () => {
		const time = Date.now() - 1000 * 10;
		const key = keyFactory({
			ttl: 1000,
			actual: {
				content: randomBytes(100).toString('hex'),
				buildedAt: time,
			},
		});

		expect(sut.keys.push({ name: key.name, value: key })).resolves;

		expect(sut.updateSignatures()).resolves;
		expect(sut.calls.updateSignatures).toEqual(1);
		expect(sut.keys[0]?.value.actual.buildedAt > time).toEqual(true);
	});
});
