import { CreateCondominiumService } from '../createCondominium.service';
import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominium } from '@tests/inMemoryDatabase/condominium';
import { CepGatewaySpy } from '@tests/gateways/CEP.gateway';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Create condominium test', () => {
	let createCondominium: CreateCondominiumService;

	let inMemoryContainer: InMemoryContainer;
	let condominiumRepo: InMemoryCondominium;
	let cepGateway: CepGatewaySpy;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		condominiumRepo = new InMemoryCondominium(inMemoryContainer);
		cepGateway = new CepGatewaySpy();

		createCondominium = new CreateCondominiumService(
			condominiumRepo,
			cepGateway,
		);
	});

	it('should be able to create a condominium', async () => {
		const condominium = condominiumFactory();

		await createCondominium.exec({ condominium });

		expect(
			condominiumRepo.condominiums[0].equalTo(condominium),
		).toBeTruthy();
		expect(cepGateway.calls.check).toEqual(1);
	});
});
