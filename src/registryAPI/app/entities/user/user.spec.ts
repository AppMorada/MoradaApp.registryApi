import { User } from '.';
import { randomUUID } from 'crypto';
import { userFactory } from '@registry:tests/factories/user';

describe('User entity test', () => {
	it('should be able to create Condominium entity', () => {
		const defaultDate = new Date();
		const defaultId = randomUUID();

		const sut1 = userFactory(
			{
				createdAt: defaultDate,
				updatedAt: defaultDate,
				condominiumId: defaultId,
			},
			defaultId,
		);
		const sut2 = userFactory(
			{
				createdAt: defaultDate,
				updatedAt: defaultDate,
				condominiumId: defaultId,
			},
			defaultId,
		);

		expect(sut1).toBeInstanceOf(User);
		expect(sut1.equalTo(sut2)).toBeTruthy();
		expect(sut1.level.value).toEqual(0);
	});
});
