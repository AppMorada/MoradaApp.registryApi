export enum RedisErrorsTags {
	notFound = 'Entity doesn\'t exist',
}

interface IProps {
	tag: RedisErrorsTags;
	message: string;
}

export class NestjsCacheLogicError extends Error {
	readonly tag: RedisErrorsTags;

	constructor(input: IProps) {
		super();

		this.name = 'NestJs Cache Logic Error';
		this.message = input.message;
		this.tag = input.tag;
	}
}
