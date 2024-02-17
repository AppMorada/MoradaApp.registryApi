import { User } from '.';
import { userFactory } from '@tests/factories/user';

describe('User entity test', () => {
	it('should be able to create Condominium entity', () => {
		const sut = userFactory();
		const withoutRef = sut.dereference();
		const withRef = sut;

		expect(sut).toBeInstanceOf(User);
		expect(sut === withRef).toBeTruthy();

		expect(sut.equalTo(withoutRef)).toBeTruthy();
		expect(sut === withoutRef).toBeFalsy();
	});
});
