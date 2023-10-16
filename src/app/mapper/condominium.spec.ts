import { condominiumFactory } from '@tests/factories/condominium';
import { CondominiumMapper } from './condominium';

describe('Condominium Mapper Test', () => {
	it('should be able to convert condominium into object and class', () => {
		const condominium = condominiumFactory();

		const condominiumInObject = CondominiumMapper.toObject(condominium);
		const sut = CondominiumMapper.toClass(condominiumInObject);

		expect(sut.equalTo(condominium)).toBeTruthy();
	});
});
