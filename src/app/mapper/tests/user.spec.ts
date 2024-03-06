import { userFactory } from '@tests/factories/user';
import { UserMapper } from '../user';

describe('User Mapper Test', () => {
	it('should be able to convert user into object and class', () => {
		const sut = userFactory();

		const objt = UserMapper.toObject(sut);
		const userClass = UserMapper.toClass(objt);

		expect(sut.equalTo(userClass)).toBeTruthy();
	});
});
