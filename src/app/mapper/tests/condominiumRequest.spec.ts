import { condominiumRequestFactory } from '@tests/factories/condominiumRequest';
import { CondominiumRequestMapper } from '../condominiumRequest';

describe('Condominium request Mapper Test', () => {
	it('should be able to convert invite into object and class', () => {
		const sut = condominiumRequestFactory();

		const objt = CondominiumRequestMapper.toObject(sut);
		const classInvite = CondominiumRequestMapper.toClass(objt);

		expect(sut.equalTo(classInvite)).toBeTruthy();
	});
});
