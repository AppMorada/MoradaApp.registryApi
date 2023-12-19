import { EntitieError } from '@registry:app/errors/entities';
import { Block } from './block';

describe('Block Value Object test', () => {
	it('should be able to create Block', () => {
		const sut1 = new Block('123456');
		const sut2 = new Block('123456');

		expect(sut1).toBeInstanceOf(Block);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Block('1234567')).toThrow(EntitieError);
	});
});
