import { UniqueRegistry } from '.';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('UniqueRegistry entity test', () => {
	it('should be able to create UniqueRegistry entity', () => {
		const sut = uniqueRegistryFactory();
		const withoutRef = sut.dereference();
		const withRef = sut;

		expect(sut).toBeInstanceOf(UniqueRegistry);
		expect(sut === withRef).toBeTruthy();

		expect(sut.equalTo(withoutRef)).toBeTruthy();
		expect(sut === withoutRef).toBeFalsy();
	});
});
