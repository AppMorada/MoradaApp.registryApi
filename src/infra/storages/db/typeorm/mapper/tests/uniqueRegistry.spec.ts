import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { TypeOrmUniqueRegistryMapper } from '../uniqueRegistry';
import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';

describe('TypeORM Unique registry entity mapper', () => {
	it('should be able to validate the mapper', () => {
		const sut = uniqueRegistryFactory();
		const uniqueRegistryAsTypeOrm =
			TypeOrmUniqueRegistryMapper.toTypeOrm(sut);
		const uniqueRegsitryAsClass = TypeOrmUniqueRegistryMapper.toClass(
			uniqueRegistryAsTypeOrm,
		);

		const uniqueRegitryAsObject = TypeOrmUniqueRegistryMapper.toObject(
			uniqueRegistryAsTypeOrm,
		);
		const uniqueRegistryAsClass2 = UniqueRegistryMapper.toClass(
			uniqueRegitryAsObject,
		);

		expect(sut.equalTo(uniqueRegsitryAsClass)).toEqual(true);
		expect(sut.equalTo(uniqueRegistryAsClass2)).toEqual(true);
	});
});
