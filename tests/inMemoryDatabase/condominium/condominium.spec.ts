import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominium } from '.';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum } from '@app/entities/entities';

describe('InMemoryData test: Condominium', () => {
	let sut: InMemoryCondominium;

	beforeEach(() => (sut = new InMemoryCondominium()));

	it('should be able to create one condominium', async () => {
		const condominium = condominiumFactory();
		expect(sut.create({ condominium })).resolves;
	});

	it('should be able to throw error: condominium already exist', async () => {
		const condominium = condominiumFactory();
		expect(sut.create({ condominium })).resolves;
		await expect(sut.create({ condominium })).rejects.toThrowError(
			new InMemoryError({
				entity: EntitiesEnum.condominium,
				message: 'Condominium already exist',
			}),
		);
	});

	it('should be able to find one condominium', async () => {
		const condominium = condominiumFactory();
		sut.condominiums.push(condominium);

		const sut2 = await sut.find({
			id: condominium.id,
		});
		const sut3 = await sut.find({
			CEP: condominium.CEP,
		});
		const sut4 = await sut.find({
			CNPJ: condominium.CNPJ,
		});
		const sut5 = await sut.find({
			name: condominium.name,
		});

		expect(sut2 && sut3 && sut2.equalTo(sut3)).toBeTruthy();
		expect(sut3 && sut4 && sut3.equalTo(sut4)).toBeTruthy();
		expect(sut4 && sut5 && sut4.equalTo(sut5)).toBeTruthy();
	});
});
