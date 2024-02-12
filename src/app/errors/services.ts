export enum ServiceErrorsTags {
	wrongServiceUsage = 'WrongServiceUsage',
	unauthorized = 'Unauthorized',
	alreadyExist = 'Conflict',
}

interface IProps {
	message: string;
	tag: ServiceErrorsTags;
}

export class ServiceErrors extends Error {
	readonly tag: ServiceErrorsTags;

	/**
	 * Erro customizado usado na camada de services, use-o caso seja necessário disparar algum erro rastreável pelos filters
	 * @param input - Deve conter a mensagem do erro e o identificador em forma de tag usado para mapear os erros na camada dos filters, use os enums vindos de ServiceErrorsTags
	 **/
	constructor(input: IProps) {
		super();

		this.name = 'Service Error';
		this.tag = input.tag;
		this.message = input.message;
	}
}
