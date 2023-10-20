import { CepGateway, ICheckCep } from '@app/gateways/CEP.gateway';

export class CepGatewayMock implements CepGateway {
	async check(): Promise<ICheckCep> {
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
