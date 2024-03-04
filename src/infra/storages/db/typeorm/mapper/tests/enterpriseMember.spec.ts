import { enterpriseMemberFactory } from '@tests/factories/enterpriseMember';
import { TypeOrmEnterpriseMemberMapper } from '../enterpriseMember';
import { EnterpriseMemberMapper } from '@app/mapper/enterpriseMember';

describe('TypeORM Enterprise member entity mapper', () => {
	it('should be able to validate the mapper', () => {
		const sut = enterpriseMemberFactory();
		const memberAsTypeOrm = TypeOrmEnterpriseMemberMapper.toTypeOrm(sut);
		const memberAsClass =
			TypeOrmEnterpriseMemberMapper.toClass(memberAsTypeOrm);

		const memberAsObject =
			TypeOrmEnterpriseMemberMapper.toObject(memberAsTypeOrm);
		const memberAsClass2 = EnterpriseMemberMapper.toClass(memberAsObject);

		expect(sut.equalTo(memberAsClass)).toEqual(true);
		expect(sut.equalTo(memberAsClass2)).toEqual(true);
	});
});
