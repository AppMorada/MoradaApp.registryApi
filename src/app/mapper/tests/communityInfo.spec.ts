import { communityInfosFactory } from '@tests/factories/communityInfos';
import { CommunityInfoMapper } from '../communityInfo';

describe('Commnity info Mapper Test', () => {
	it('should be able to convert community info into object and class', () => {
		const sut = communityInfosFactory();

		const objt = CommunityInfoMapper.toObject(sut);
		const classMember = CommunityInfoMapper.toClass(objt);

		expect(sut.equalTo(classMember)).toBeTruthy();
	});
});
