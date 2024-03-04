import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { TypeOrmCondominiumMemberMapper } from '../condominiumMember';
import { CondominiumMemberMapper } from '@app/mapper/condominiumMember';

describe('TypeORM Condominium member entity mapper', () => {
	it('should be able to validate the mapper', () => {
		const sut = condominiumMemberFactory();
		const memberAsTypeOrm = TypeOrmCondominiumMemberMapper.toTypeOrm(sut);
		const memberAsClass =
			TypeOrmCondominiumMemberMapper.toClass(memberAsTypeOrm);

		const memberAsObject =
			TypeOrmCondominiumMemberMapper.toObject(memberAsTypeOrm);
		const memberAsClass2 = CondominiumMemberMapper.toClass(memberAsObject);

		expect(sut.equalTo(memberAsClass)).toEqual(true);
		expect(sut.equalTo(memberAsClass2)).toEqual(true);
	});
});
