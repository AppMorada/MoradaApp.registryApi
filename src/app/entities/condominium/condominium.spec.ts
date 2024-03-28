import { condominiumFactory } from '@tests/factories/condominium';
import { Condominium } from '.';
import { UUID } from '../VO';
import { randomBytes } from 'crypto';
import { generateRandomChars } from '@utils/generateRandomChars';

describe('Condominium entity test', () => {
	it('should be able to create Condominium entity', () => {
		const defaultDate = new Date();
		const defaultId = UUID.genV4().value;
		const seedKey = randomBytes(200).toString('hex');
		const ownerId = UUID.genV4().value;
		const humanReadableId = generateRandomChars(8);

		const sut1 = condominiumFactory(
			{
				ownerId,
				seedKey,
				humanReadableId,
				createdAt: defaultDate,
				updatedAt: defaultDate,
			},
			defaultId,
		);
		const sut2 = condominiumFactory(
			{
				ownerId,
				seedKey,
				humanReadableId,
				createdAt: defaultDate,
				updatedAt: defaultDate,
			},
			defaultId,
		);

		expect(sut1).toBeInstanceOf(Condominium);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});
});
