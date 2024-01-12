import { condominiumRelUserFactory } from '@registry:tests/factories/condominiumRelUser';
import { CondominiumRelUserPrismaMapper } from './condominiumRelUser';

describe('Condominium Rel User Mapper Prisma Test', () => {
	it('should be able to map condominium rel user in prisma', () => {
		const condominiumRelUser = condominiumRelUserFactory();

		const condominiumRelUserInPrisma =
			CondominiumRelUserPrismaMapper.toPrisma(condominiumRelUser);
		const sut = CondominiumRelUserPrismaMapper.toClass(
			condominiumRelUserInPrisma,
		);

		expect(sut.equalTo(condominiumRelUser)).toBeTruthy();
	});
});
