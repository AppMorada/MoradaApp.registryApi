interface IProps {
	message: string;
	httpCode?: number;
}

export class AdapterError extends Error {
	readonly httpCode: number | undefined;

	/**
	 * Erro customizado usado na camada de adaptadores, use-o caso seja necessário disparar algum erro rastreável pelos filters
	 * @param input- Deve conter a mensagem do erro e o código http
	 **/
	constructor(input: IProps) {
		super();

		this.name = 'Adapter Error';
		this.httpCode = input.httpCode;
		this.message = input.message;
	}
}
