import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominium } from '.';
import { InMemoryError } from '@tests/errors/inMemoryError';

describe('InMemoryData test: Condominium', () => {
	let sut: InMemoryCondominium;

	beforeEach(() => (sut = new InMemoryCondominium()));

	it('should be able to create one condominium', async () => {
		const condominium = condominiumFactory();
		expect(sut.create({ condominium })).resolves;
	});

	it('should be able to create one condominium', async () => {
		const condominium = condominiumFactory();
		expect(sut.create({ condominium })).resolves;
		expect(() => sut.create({ condominium })).toThrowError(InMemoryError);
	});
});
