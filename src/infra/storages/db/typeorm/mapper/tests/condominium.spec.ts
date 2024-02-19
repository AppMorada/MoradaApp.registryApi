import { condominiumFactory } from '@tests/factories/condominium';
import { TypeOrmCondominiumMapper } from '../condominium';
import { CondominiumMapper } from '@app/mapper/condominium';

describe('TypeORM Condominium entity mapper', () => {
	it('should be able to validate the mapper', () => {
		const sut = condominiumFactory();
		const condominiumAsTypeOrm = TypeOrmCondominiumMapper.toTypeOrm(sut);
		const condominiumAsClass =
			TypeOrmCondominiumMapper.toClass(condominiumAsTypeOrm);

		const condominiumAsObject =
			TypeOrmCondominiumMapper.toObject(condominiumAsTypeOrm);
		const condominiumAsClass2 =
			CondominiumMapper.toClass(condominiumAsObject);

		expect(sut.equalTo(condominiumAsClass)).toEqual(true);
		expect(sut.equalTo(condominiumAsClass2)).toEqual(true);
	});
});
