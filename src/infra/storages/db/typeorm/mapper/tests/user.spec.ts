import { userFactory } from '@tests/factories/user';
import { TypeOrmUserMapper } from '../user';
import { UserMapper } from '@app/mapper/user';

describe('TypeORM User entity mapper', () => {
	it('should be able to validate the mapper', () => {
		const sut = userFactory();
		const userAsTypeOrm = TypeOrmUserMapper.toTypeOrm(sut);
		const userAsClass = TypeOrmUserMapper.toClass(userAsTypeOrm);

		const userAsObject = TypeOrmUserMapper.toObject(userAsTypeOrm);
		const userAsClass2 = UserMapper.toClass(userAsObject);

		expect(sut.equalTo(userAsClass)).toEqual(true);
		expect(sut.equalTo(userAsClass2)).toEqual(true);
	});
});
