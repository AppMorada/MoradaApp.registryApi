import { communityInfosFactory } from '@tests/factories/communityInfos';
import { TypeOrmCommunityInfoMapper } from '../communityInfo';
import { CommunityInfoMapper } from '@app/mapper/communityInfo';

describe('TypeORM Community infos entity mapper', () => {
	it('should be able to validate the mapper', () => {
		const sut = communityInfosFactory();
		const memberAsTypeOrm = TypeOrmCommunityInfoMapper.toTypeOrm(sut);
		const memberAsClass =
			TypeOrmCommunityInfoMapper.toClass(memberAsTypeOrm);

		const memberAsObject =
			TypeOrmCommunityInfoMapper.toObject(memberAsTypeOrm);
		const memberAsClass2 = CommunityInfoMapper.toClass(memberAsObject);

		expect(sut.equalTo(memberAsClass)).toEqual(true);
		expect(sut.equalTo(memberAsClass2)).toEqual(true);
	});
});
