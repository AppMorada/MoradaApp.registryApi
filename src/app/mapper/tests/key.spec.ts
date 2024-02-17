import { keyFactory } from '@tests/factories/key';
import { KeyMapper } from '../key';

describe('Key Mapper Test', () => {
	it('should be able to convert key into object and class', () => {
		const sut = keyFactory();

		const keyAsObject = KeyMapper.toObject(sut);
		const keyAsClass = KeyMapper.toClass(keyAsObject);

		expect(sut.equalTo(keyAsClass)).toBeTruthy();
	});
});
