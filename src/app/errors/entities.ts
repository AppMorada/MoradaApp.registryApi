import { EntitiesEnum } from '@app/entities/entities';

interface IProps {
	entity: EntitiesEnum;
	message: string;
}

export class EntitieError extends Error {
	readonly entity: EntitiesEnum;

	/**
	 * Erro customizado usado na camada de entidades, use-o caso seja necessário disparar algum erro rastreável pelos filters
	 * @param input - Deve conter a mensagem do erro e a entidade envolvida, use EntitiesEnum para fazer esta indicação
	 **/
	constructor(input: IProps) {
		super();

		this.name =
			input.entity === EntitiesEnum.vo
				? 'Value Object error'
				: 'Entity error';
		this.message = input.message;
		this.entity = input.entity;
	}
}
