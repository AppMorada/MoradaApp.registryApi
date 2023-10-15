import { EntitiesEnum } from '@app/entities/entities';

interface IProps {
	entity: EntitiesEnum;
	message: string;
}

export class EntitieError extends Error {
	readonly entity: EntitiesEnum;

	constructor(input: IProps) {
		super();

		this.name =
			input.entity === EntitiesEnum.vo
				? 'Value Object error.'
				: 'Entity error.';
		this.message = input.message;
		this.entity = input.entity;
	}
}
