import { CepGateway, ICheckCep } from '@registry:app/gateways/CEP.gateway';

export class CepGatewaySpy implements CepGateway {
	calls = {
		check: 0,
	};

	async check(): Promise<ICheckCep> {
		this.calls.check = this.calls.check + 1;
		return {
			city: 'any',
			street_address: 'any',
			complement: 'any',
			neighborhood: 'any',
			cep: 'any',
			uf: 'any',
		};
	}
}
