interface IProps {
	message: string;
}

export class GuardErrors extends Error {
	constructor(input: IProps) {
		super();

		this.name = 'Guard Error';
		this.message = input.message;
	}
}
