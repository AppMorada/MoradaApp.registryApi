import { EntitieError } from '@registry:app/errors/entities';
import { Level } from '.';

describe('Level Value Object test', () => {
	it('should be able to create Level', () => {
		const sut1 = new Level(0);
		const sut2 = new Level(0);

		expect(sut1).toBeInstanceOf(Level);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Level(4)).toThrow(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Level(5)).toThrow(EntitieError);
	});
});
