import { CondominiumRelUserMapper } from '../condominiumRelUser';
import { condominiumRelUserFactory } from '@tests/factories/condominiumRelUser';

describe('CondominiumRelUser Mapper Test', () => {
	it('should be able to convert CondominiumRelUser into object and class', () => {
		const condominiumUserRel = condominiumRelUserFactory();

		const condominiumUserRelInObject =
			CondominiumRelUserMapper.toObject(condominiumUserRel);
		const sut = CondominiumRelUserMapper.toClass(
			condominiumUserRelInObject,
		);

		expect(sut.equalTo(condominiumUserRel)).toBeTruthy();
	});
});
