import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { UniqueRegistryMapper } from '../uniqueRegistry';

describe('Unique Registry info Mapper Test', () => {
	it('should be able to convert a unique registry into object and class', () => {
		const sut = uniqueRegistryFactory();

		const objt = UniqueRegistryMapper.toObject(sut);
		const classMember = UniqueRegistryMapper.toClass(objt);

		expect(sut.equalTo(classMember)).toBeTruthy();
	});
});
