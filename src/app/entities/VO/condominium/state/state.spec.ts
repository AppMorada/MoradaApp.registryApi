import { EntitieError } from '@app/errors/entities';
import { State } from '.';

describe('State Value Object test', () => {
	it('should be able to create state', () => {
		const sut1 = new State('1234');
		const sut2 = new State('1234');

		expect(sut1).toBeInstanceOf(State);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new State('1'.repeat(241))).toThrow(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new State('123')).toThrow(EntitieError);
	});
});
