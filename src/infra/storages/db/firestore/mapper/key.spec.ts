import { keyFactory } from '@tests/factories/key';
import { FirestoreKeyMapper } from './key';

describe('Firestore Key Mapper', () => {
	it('should be able to execute flat method', () => {
		const key = keyFactory({ name: 'default name', id: 'default name' });
		const flatKey = FirestoreKeyMapper.toFlat(key);
		const commonKey = FirestoreKeyMapper.fromFlatToClass(flatKey);

		expect(commonKey.equalTo({ key, ignoreRenewTime: true })).toBe(true);
	});
});
