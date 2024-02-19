import { TypeOrmCondominiumRelUserMapper } from '../condominiumRelUser';
import { condominiumRelUserFactory } from '@tests/factories/condominiumRelUser';
import { CondominiumRelUserMapper } from '@app/mapper/condominiumRelUser';

describe('TypeORM CondominiumRelUser entity mapper', () => {
	it('should be able to validate the mapper', () => {
		const sut = condominiumRelUserFactory();
		const condominiumRelUserAsTypeOrm =
			TypeOrmCondominiumRelUserMapper.toTypeOrm(sut);
		const condominiumRelUserAsClass =
			TypeOrmCondominiumRelUserMapper.toClass(
				condominiumRelUserAsTypeOrm,
			);

		const condominiumRelUserAsObject =
			TypeOrmCondominiumRelUserMapper.toObject(
				condominiumRelUserAsTypeOrm,
			);
		const condominiumRelUserAsClass2 = CondominiumRelUserMapper.toClass(
			condominiumRelUserAsObject,
		);

		expect(sut.equalTo(condominiumRelUserAsClass)).toEqual(true);
		expect(sut.equalTo(condominiumRelUserAsClass2)).toEqual(true);
	});
});
