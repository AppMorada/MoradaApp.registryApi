import { keyFactory } from '@tests/factories/key';

describe('Key Entitie Test', () => {
	it('should be able to create a key entitie', () => {
		const sut = keyFactory();
		const key = sut;

		expect(sut.equalTo(key)).toBe(true);

		const actualTime = Date.now();
		const key2 = keyFactory({
			name: 'another key',
			ttl: 60 * 60 * 1000,
			renewTime: actualTime + 60 * 60 * 1000,
			actual: {
				buildedAt: actualTime - 10000,
				content: key.actual.content,
			},
		});
		expect(key.equalTo(key2)).toBe(false);
	});
});
