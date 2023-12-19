import { userFactory } from '@registry:tests/factories/user';
import { UserMapper } from './user';

describe('User Mapper Test', () => {
	it('should be able to convert user into object and class', () => {
		const user = userFactory();

		const userInObject = UserMapper.toObject(user);
		const sut = UserMapper.toClass(userInObject);

		expect(sut.equalTo(user)).toBeTruthy();
	});
});
