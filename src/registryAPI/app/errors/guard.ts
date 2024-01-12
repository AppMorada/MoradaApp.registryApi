interface IProps {
	message: string;
}

export class GuardErrors extends Error {
	/**
	 * Erro customizado usado na camada de guards, use-o caso seja necessário disparar algum erro rastreável pelos filters
	 * @param input - Deve conter a mensagem do erro
	 **/
	constructor(input: IProps) {
		super();

		this.name = 'Guard Error';
		this.message = input.message;
	}
}
