export enum GatewaysErrorsTags {
	InvalidResult = 'Invalid Result',
}

interface IProps {
	message: string;
	tag: GatewaysErrorsTags;
}

export class GatewayErrors extends Error {
	readonly tag: GatewaysErrorsTags;

	constructor(input: IProps) {
		super();

		this.name = 'Gateway Error';
		this.tag = input.tag;
		this.message = input.message;
	}
}
