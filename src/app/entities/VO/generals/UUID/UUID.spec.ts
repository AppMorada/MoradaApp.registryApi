import { EntitieError } from '@app/errors/entities';
import { UUID } from '.';

describe('UUID Value Object test', () => {
	it('should be able to create UUID', () => {
		const uuid = UUID.genV4().value;
		const sut1 = new UUID(uuid);
		const sut2 = new UUID(uuid);

		expect(sut1).toBeInstanceOf(UUID);
		expect(sut1.equalTo(sut2)).toBeTruthy();
		expect(UUID.check(sut1.value)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new UUID('a41e70e8-b4bc-412f-85c7-3ab523ba9665a')).toThrow(
			EntitieError,
		);
	});

	it('should be able to throw one error: unknown version', () => {
		expect(() => new UUID('a41e70e8-b4bc-912f-85c7-3ab523ba9665')).toThrow(
			EntitieError,
		);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new UUID('a41e70e8-b4bc-912f-85c')).toThrow(EntitieError);
	});
});
