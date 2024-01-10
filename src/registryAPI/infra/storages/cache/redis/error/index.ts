export enum RedisErrorsTags {
	alreadyExist = 'Entitie already exists',
}

interface IProps {
	tag: RedisErrorsTags;
	message: string;
}

export class RedisLogicError extends Error {
	readonly tag: RedisErrorsTags;

	/**
	 * Erro customizado usado na camada de banco de dados cache, use-o caso seja necessário disparar algum erro rastreável pelos filters
	 * @param input - Deve conter a mensagem do erro e o identificador usado para mapear os erros na camada dos filters, use os enums vindos de RedisErrorsTags
	 **/
	constructor(input: IProps) {
		super();

		this.name = 'Redis Logic Error';
		this.message = input.message;
		this.tag = input.tag;
	}
}
