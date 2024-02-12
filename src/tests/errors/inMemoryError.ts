import { EntitiesEnum } from '@app/entities/entities';

interface IProps {
	entity: EntitiesEnum;
	message: string;
}

export class InMemoryError extends Error {
	readonly entity: EntitiesEnum;

	constructor(input: IProps) {
		super();

		this.name = `In Memory Error: ${input.entity}`;
		this.message = input.message;
		this.entity = input.entity;
	}
}
