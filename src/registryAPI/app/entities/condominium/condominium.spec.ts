import { condominiumFactory } from '@registry:tests/factories/condominium';
import { Condominium } from '.';
import { randomUUID } from 'crypto';

describe('Condominium entity test', () => {
	it('should be able to create Condominium entity', () => {
		const defaultDate = new Date();
		const defaultId = randomUUID();

		const sut1 = condominiumFactory(
			{
				createdAt: defaultDate,
				updatedAt: defaultDate,
			},
			defaultId,
		);
		const sut2 = condominiumFactory(
			{
				createdAt: defaultDate,
				updatedAt: defaultDate,
			},
			defaultId,
		);

		expect(sut1).toBeInstanceOf(Condominium);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});
});
