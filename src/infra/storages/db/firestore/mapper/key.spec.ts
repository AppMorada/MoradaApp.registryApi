import { keyFactory } from '@tests/factories/key';
import { FirestoreKeyMapper } from './key';

describe('Firestore Key Mapper', () => {
	it('should be able to execute flat method', () => {
		const sut = keyFactory({ name: 'default name', id: 'default name' });
		const flatKey = FirestoreKeyMapper.toFlat(sut);
		const commonKey = FirestoreKeyMapper.fromFlatToClass(flatKey);

		expect(sut.equalTo(commonKey)).toBe(true);
	});
});
