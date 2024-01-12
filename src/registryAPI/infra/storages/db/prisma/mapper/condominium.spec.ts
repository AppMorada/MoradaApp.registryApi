import { condominiumFactory } from '@registry:tests/factories/condominium';
import { CondominiumPrismaMapper } from './condominium';

describe('Condominium Mapper Prisma Test', () => {
	it('should be able to map condominium in prisma', () => {
		const condominium = condominiumFactory();

		const condominiumInPrisma =
			CondominiumPrismaMapper.toPrisma(condominium);
		const sut = CondominiumPrismaMapper.toClass(condominiumInPrisma);

		expect(sut.equalTo(condominium)).toBeTruthy();
	});
});
