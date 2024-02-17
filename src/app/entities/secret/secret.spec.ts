import { secretFactory } from '@tests/factories/secret';
import { Secret } from '.';

describe('Secret entity test', () => {
	it('should be able to create Secret entity', () => {
		const sut = secretFactory();
		const withoutRef = sut.dereference();
		const withRef = sut;

		expect(sut).toBeInstanceOf(Secret);
		expect(sut === withRef).toBeTruthy();

		expect(sut.equalTo(withoutRef)).toBeTruthy();
		expect(sut === withoutRef).toBeFalsy();
	});
});
