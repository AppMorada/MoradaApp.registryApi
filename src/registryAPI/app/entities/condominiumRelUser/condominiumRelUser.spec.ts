import { condominiumRelUserFactory } from '@registry:tests/factories/condominiumRelUser';
import { CondominiumRelUser } from '.';
import { UUID } from '../VO';

describe('CondominiumRel class test', () => {
	it('should be able to create a CondominiumRel', () => {
		const id = UUID.genV4().value;
		const userId = UUID.genV4().value;
		const condominiumId = UUID.genV4().value;
		const updatedAt = new Date();

		const sut = condominiumRelUserFactory(
			{
				condominiumId,
				userId,
				updatedAt,
			},
			id,
		);
		const sut2 = condominiumRelUserFactory(
			{
				condominiumId,
				userId,
				updatedAt,
			},
			id,
		);

		expect(sut instanceof CondominiumRelUser).toBeTruthy();
		expect(sut.equalTo(sut2)).toBeTruthy();

		const sut3 = sut.dereference();
		expect(sut3 === sut).toBeFalsy();
		expect(sut3.equalTo(sut));
	});
});
