import { User } from '.';
import { userFactory } from '@tests/factories/user';

describe('User entity test', () => {
	it('should be able to create Condominium entity', () => {
		const sut1 = userFactory();
		const sut2WithoutRef = sut1.dereference();
		const sut3WithRef = sut1;

		expect(sut1).toBeInstanceOf(User);
		expect(sut1 === sut3WithRef).toBeTruthy();

		expect(sut1.equalTo(sut2WithoutRef)).toBeTruthy();
		expect(sut1 === sut2WithoutRef).toBeFalsy();
	});
});
