import { CreateCondominiumService } from '../../condominium/create.service';
import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumCreate } from '@tests/inMemoryDatabase/condominium/write/create';
import { CepGatewaySpy } from '@tests/gateways/CEP.gateway';
import { userFactory } from '@tests/factories/user';

describe('Create condominium service test', () => {
	let sut: CreateCondominiumService;

	let createCondominiumRepo: InMemoryCondominiumCreate;
	let cepGateway: CepGatewaySpy;

	beforeEach(() => {
		createCondominiumRepo = new InMemoryCondominiumCreate();
		cepGateway = new CepGatewaySpy();

		sut = new CreateCondominiumService(createCondominiumRepo, cepGateway);
	});

	it('should be able to create a condominium', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });

		await sut.exec({
			user,
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
		expect(createCondominiumRepo.calls.exec).toEqual(1);
	});
});
