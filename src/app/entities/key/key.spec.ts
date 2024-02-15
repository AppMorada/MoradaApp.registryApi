import { keyFactory } from '@tests/factories/key';

describe('Key Entitie Test', () => {
	it('should be able to create a key entitie', () => {
		const key = keyFactory();
		const anotherKey = key;

		expect(key.equalTo({ key: anotherKey })).toBe(true);

		const actualTime = Date.now();
		const anotherKey2 = keyFactory({
			name: 'another key',
			ttl: 60 * 60 * 1000,
			renewTime: actualTime + 60 * 60 * 1000,
			actual: {
				buildedAt: actualTime - 10000,
				content: key.actual.content,
			},
		});
		expect(key.equalTo({ key: anotherKey2 })).toBe(false);
	});
});
