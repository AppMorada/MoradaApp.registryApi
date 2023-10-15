import { EntitieError } from '@app/errors/entities';
import { Name } from './name';

describe('Name Value Object test', () => {
	it('should be able to create Name', () => {
		const sut1 = new Name('John Doe');
		const sut2 = new Name('John Doe');

		expect(sut1).toBeInstanceOf(Name);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Name('A')).toThrowError(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Name('A'.repeat(121))).toThrowError(EntitieError);
	});
});
