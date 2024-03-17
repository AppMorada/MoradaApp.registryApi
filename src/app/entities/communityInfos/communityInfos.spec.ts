import { CommunityInfos } from '.';
import { communityInfosFactory } from '@tests/factories/communityInfos';

describe('CommunityInfos entity test', () => {
	it('should be able to create CommunityInfos entity', () => {
		const sut = communityInfosFactory();
		const withoutRef = sut.dereference();
		const withRef = sut;

		expect(sut).toBeInstanceOf(CommunityInfos);
		expect(sut === withRef).toBeTruthy();

		expect(sut.equalTo(withoutRef)).toBeTruthy();
		expect(sut === withoutRef).toBeFalsy();
	});
});
