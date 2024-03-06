import { enterpriseMemberFactory } from '@tests/factories/enterpriseMember';
import { EnterpriseMemberMapper } from '../enterpriseMember';

describe('Enterprise member Mapper Test', () => {
	it('should be able to convert enterprise member into object and class', () => {
		const sut = enterpriseMemberFactory();

		const objt = EnterpriseMemberMapper.toObject(sut);
		const classMember = EnterpriseMemberMapper.toClass(objt);

		expect(sut.equalTo(classMember)).toBeTruthy();
	});
});
