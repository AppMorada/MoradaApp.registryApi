import { CreateCondominiumService } from '../../condominium/create.service';
import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumWriteOps } from '@tests/inMemoryDatabase/condominium/write';
import { CepGatewaySpy } from '@tests/gateways/CEP.gateway';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { userFactory } from '@tests/factories/user';

describe('Create condominium service test', () => {
	let sut: CreateCondominiumService;

	let inMemoryContainer: InMemoryContainer;
	let condominiumRepo: InMemoryCondominiumWriteOps;
	let cepGateway: CepGatewaySpy;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		condominiumRepo = new InMemoryCondominiumWriteOps(inMemoryContainer);
		cepGateway = new CepGatewaySpy();

		sut = new CreateCondominiumService(condominiumRepo, cepGateway);
	});

	it('should be able to create a condominium', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });

		await sut.exec({
			ownerId: user.id.value,
			name: condominium.name.value,
			CEP: condominium.CEP.value,
			num: condominium.num.value,
			CNPJ: condominium.CNPJ.value,
			district: condominium.district.value,
			city: condominium.city.value,
			state: condominium.state.value,
			reference: condominium.reference?.value,
			complement: condominium.complement?.value,
		});

		expect(cepGateway.calls.check).toEqual(1);
		expect(condominiumRepo.calls.create).toEqual(1);
	});
});
