import { TypeOrmCondominiumRequestMapper } from '../condominiumRequest';
import { condominiumRequestFactory } from '@tests/factories/condominiumRequest';
import { CondominiumRequestMapper } from '@app/mapper/condominiumRequest';

describe('TypeORM Condominium request mapper', () => {
	it('should be able to validate the mapper', () => {
		const sut = condominiumRequestFactory();
		const requestAsTypeOrm = TypeOrmCondominiumRequestMapper.toTypeOrm(sut);
		const requestAsClass =
			TypeOrmCondominiumRequestMapper.toClass(requestAsTypeOrm);

		const requestAsObject =
			TypeOrmCondominiumRequestMapper.toObject(requestAsTypeOrm);
		const requestAsClass2 =
			CondominiumRequestMapper.toClass(requestAsObject);

		expect(sut.equalTo(requestAsClass)).toEqual(true);
		expect(sut.equalTo(requestAsClass2)).toEqual(true);
	});
});
