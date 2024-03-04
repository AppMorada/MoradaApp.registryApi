import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { CondominiumMemberMapper } from '../condominiumMember';

describe('Condominium member Mapper Test', () => {
	it('should be able to convert condominium member into object and class', () => {
		const sut = condominiumMemberFactory();

		const objt = CondominiumMemberMapper.toObject(sut);
		const classMember = CondominiumMemberMapper.toClass(objt);

		expect(sut.equalTo(classMember)).toBeTruthy();
	});
});
