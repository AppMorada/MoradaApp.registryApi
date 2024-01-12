export enum GatewaysErrorsTags {
	InvalidResult = 'Invalid Result',
	PoisonedContent = 'Poisoned Content',
}

interface IProps {
	message: string;
	content?: any;
	tag: GatewaysErrorsTags;
}

export class GatewayErrors extends Error {
	readonly tag: GatewaysErrorsTags;
	readonly content: any;

	/**
	 * Erro customizado usado na camada de gateways, use-o caso seja necessário disparar algum erro rastreável pelos filters
	 * @param input - Deve conter a mensagem do erro, o conteúdo e a tag de rastramento para os filters, use o GatewaysErrorsTags
	 **/
	constructor(input: IProps) {
		super();

		this.name = 'Gateway Error';
		this.tag = input.tag;
		this.message = input.message;
		this.content = input.content;
	}
}
