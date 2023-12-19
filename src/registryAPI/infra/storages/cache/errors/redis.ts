export enum RedisErrorsTags {
	alreadyExist = 'Entitie already exists',
}

interface IProps {
	tag: RedisErrorsTags;
	message: string;
}

export class RedisLogicError extends Error {
	readonly tag: RedisErrorsTags;

	constructor(input: IProps) {
		super();

		this.name = 'Redis Logic Error';
		this.message = input.message;
		this.tag = input.tag;
	}
}
