import { EntitieError } from '@app/errors/entities';
import { UUID } from '.';
import { UUIDGroup } from './group';

describe('UUID Group test', () => {
	it('should be able to create a group of UUIDs', () => {
		const sut1 = new UUIDGroup([UUID.genV4().value, UUID.genV4().value]);
		const sut2AsRef = sut1;
		const sut3WithoutRef = new UUIDGroup([...sut1.value]);

		expect(sut1 instanceof UUIDGroup).toBeTruthy();
		expect(sut1.equalTo(sut2AsRef)).toBeTruthy();
		expect(sut1.equalTo(sut3WithoutRef)).toBeTruthy();

		sut3WithoutRef.value.add(UUID.genV4().value);
		sut3WithoutRef.value.add(UUID.genV4().value);

		expect(sut1.equalTo(sut3WithoutRef)).toBeFalsy();
		expect(sut3WithoutRef.equalTo(sut1)).toBeFalsy();
	});

	it('should throw one error - wrong UUID', () => {
		expect(() => new UUIDGroup(['wrong uuid'])).toThrow(EntitieError);
	});
});
