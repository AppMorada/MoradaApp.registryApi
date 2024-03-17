export enum NestjsErrorsTags {
	notFound = 'Entity doesn\'t exist',
}

interface IProps {
	tag: NestjsErrorsTags;
	message: string;
}

export class NestjsCacheLogicError extends Error {
	readonly tag: NestjsErrorsTags;

	constructor(input: IProps) {
		super();

		this.name = 'NestJs Cache Logic Error';
		this.message = input.message;
		this.tag = input.tag;
	}
}
