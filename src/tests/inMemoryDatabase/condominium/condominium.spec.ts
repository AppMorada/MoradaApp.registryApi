import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominium } from '.';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';

describe('InMemoryData test: Condominium', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominium;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominium(container);
	});

	it('should be able to create one condominium', async () => {
		const condominium = condominiumFactory();
		expect(sut.create({ condominium })).resolves;
		expect(sut.calls.create).toEqual(1);
	});

	it('should be able to throw error: condominium already exist', async () => {
		const condominium = condominiumFactory();
		expect(sut.create({ condominium })).resolves;
		await expect(sut.create({ condominium })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.condominium,
				message: 'Condominium already exist',
			}),
		);
		expect(sut.calls.create).toEqual(2);
	});

	it('should be able to find one condominium', async () => {
		const condominium = condominiumFactory();
		sut.condominiums.push(condominium);

		const sut2 = await sut.find({ key: condominium.id });
		const sut3 = await sut.find({ key: condominium.CEP });
		const sut4 = await sut.find({ key: condominium.CNPJ });
		const sut5 = await sut.find({ key: condominium.name });

		expect(sut2 && sut3 && sut2.equalTo(sut3)).toBeTruthy();
		expect(sut3 && sut4 && sut3.equalTo(sut4)).toBeTruthy();
		expect(sut4 && sut5 && sut4.equalTo(sut5)).toBeTruthy();
		expect(sut.calls.find).toEqual(4);
	});

	it('should be able to throw one error: Condominium doesn\'t exists', async () => {
		const condominium = condominiumFactory();

		await expect(
			sut.find({ key: condominium.id, safeSearch: true }),
		).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.condominium,
				message: 'Condominium not found',
			}),
		);

		expect(sut.calls.find).toEqual(1);
	});
});
