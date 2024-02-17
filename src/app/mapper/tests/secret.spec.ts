import { secretFactory } from '@tests/factories/secret';
import { SecretMapper } from '../secret';

describe('Secret Mapper Test', () => {
	it('should be able to convert secret into object and class', () => {
		const sut = secretFactory();

		const secretAsObject = SecretMapper.toObject(sut);
		const secretAsClass = SecretMapper.toClass(secretAsObject);

		expect(sut.equalTo(secretAsClass)).toBeTruthy();
	});
});
