interface IProps {
	message: string;
	httpCode?: number;
}

export class AdapterError extends Error {
	readonly httpCode: number | undefined;

	constructor(input: IProps) {
		super();

		this.name = 'Adapter Error';
		this.httpCode = input.httpCode;
		this.message = input.message;
	}
}
