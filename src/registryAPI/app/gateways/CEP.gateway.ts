export interface ICheckCep {
	cep: string;
	street_address: string;
	complement: string;
	neighborhood: string;
	city: string;
	uf: string;
}

export abstract class CepGateway {
	abstract check(input: string): Promise<ICheckCep>;
}
