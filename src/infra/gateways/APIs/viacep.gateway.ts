import { HttpAdapter } from '@app/adapters/http';
import { CepGateway, ICheckCep } from '@app/gateways/CEP.gateway';
import { Injectable } from '@nestjs/common';
import { GatewayErrors, GatewaysErrorsTags } from '../errors';

interface ISuccess {
	cep: string;
	logradouro: string;
	complemento: string;
	bairro: string;
	localidade: string;
	uf: string;
	ibge: string;
	gia: string;
	ddd: string;
	siafi: string;
}

@Injectable()
export class ViacepGateway implements CepGateway {
	constructor(private readonly httpAdapter: HttpAdapter) {}

	async check(input: string): Promise<ICheckCep> {
		const data = await this.httpAdapter.call({
			url: `https://viacep.com.br/ws/${input}/json/`,
			method: 'GET',
		});

		if (data.body?.erro)
			throw new GatewayErrors({
				tag: GatewaysErrorsTags.InvalidResult,
				message: `Could not finish the request: https://viacep.com.br/ws/${input}/json/. Received 'erro' field as true!`,
			});

		const body = data.body as ISuccess;
		return {
			uf: body.uf,
			cep: body.cep,
			neighborhood: body.bairro,
			complement: body.complemento,
			city: body.localidade,
			street_address: body.logradouro,
		};
	}
}
