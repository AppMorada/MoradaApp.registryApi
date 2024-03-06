import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { CondominiumMember } from '.';

describe('CondominiumMember entity test', () => {
	it('should be able to create CondominiumMember entity', () => {
		const sut = condominiumMemberFactory();
		const withoutRef = sut.dereference();
		const withRef = sut;

		expect(sut).toBeInstanceOf(CondominiumMember);
		expect(sut === withRef).toBeTruthy();

		expect(sut.equalTo(withoutRef)).toBeTruthy();
		expect(sut === withoutRef).toBeFalsy();
	});
});
