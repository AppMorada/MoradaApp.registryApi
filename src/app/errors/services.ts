export enum ServiceErrorsTags {
	unauthorized = 'Unauthorized',
}

interface IProps {
	message: string;
	tag: ServiceErrorsTags;
}

export class ServiceErrors extends Error {
	readonly tag: ServiceErrorsTags;

	constructor(input: IProps) {
		super();

		this.name = 'Service Error';
		this.tag = input.tag;
		this.message = input.message;
	}
}
