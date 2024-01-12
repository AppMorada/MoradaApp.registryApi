import { userFactory } from '@registry:tests/factories/user';
import { UserPrismaMapper } from './user';

describe('User Mapper Prisma Test', () => {
	it('should be able to map user in prisma', () => {
		const user = userFactory();

		const userInPrisma = UserPrismaMapper.toPrisma(user);
		const sut = UserPrismaMapper.toClass(userInPrisma);

		expect(sut.equalTo(user)).toBeTruthy();
	});
});
