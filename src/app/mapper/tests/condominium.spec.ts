import { condominiumFactory } from '@tests/factories/condominium';
import { CondominiumMapper } from '../condominium';

describe('Condominium Mapper Test', () => {
	it('should be able to convert condominium into object and class', () => {
		const sut = condominiumFactory();

		const objt = CondominiumMapper.toObject(sut);
		const classCondominium = CondominiumMapper.toClass(objt);

		expect(sut.equalTo(classCondominium)).toBeTruthy();
	});
});
