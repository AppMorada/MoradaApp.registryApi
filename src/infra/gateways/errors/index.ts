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

	constructor(input: IProps) {
		super();

		this.name = 'Gateway Error';
		this.tag = input.tag;
		this.message = input.message;
		this.content = input.content;
	}
}
