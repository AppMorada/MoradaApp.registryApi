import { keyFactory } from '@tests/factories/key';

describe('Key Entitie Test', () => {
	it('should be able to create a key entitie', () => {
		const key = keyFactory();
		const anotherKey = key;

		expect(key.equalTo({ key: anotherKey })).toBe(true);

		const anotherKey2 = keyFactory({
			name: 'another key',
		});
		expect(key.equalTo({ key: anotherKey2 })).toBe(false);
	});
});
