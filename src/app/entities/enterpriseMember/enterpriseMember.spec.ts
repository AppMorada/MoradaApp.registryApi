import { enterpriseMemberFactory } from '@tests/factories/enterpriseMember';
import { EnterpriseMember } from '.';

describe('EnterpriseMember entity test', () => {
	it('should be able to create EnterpriseMember entity', () => {
		const sut = enterpriseMemberFactory();
		const withoutRef = sut.dereference();
		const withRef = sut;

		expect(sut).toBeInstanceOf(EnterpriseMember);
		expect(sut === withRef).toBeTruthy();

		expect(sut.equalTo(withoutRef)).toBeTruthy();
		expect(sut === withoutRef).toBeFalsy();
	});
});
