import { condominiumRequestFactory } from '@tests/factories/condominiumRequest';
import { CondominiumRequest } from '.';

describe('Condominium request test', () => {
	it('should be able to create condominium request', () => {
		const sut = condominiumRequestFactory();
		const withoutRef = sut.dereference();
		const withRef = sut;

		expect(sut).toBeInstanceOf(CondominiumRequest);
		expect(sut === withRef).toBeTruthy();

		expect(sut.equalTo(withoutRef)).toBeTruthy();
		expect(sut === withoutRef).toBeFalsy();
	});
});
