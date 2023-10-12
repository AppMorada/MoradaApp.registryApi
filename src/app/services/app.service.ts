interface IProps {
	message: string;
}

export class AppService {
	constructor() {}

	private counter: number = 0;

	exec(input: IProps) {
		return `Message ${++this.counter}: ${input.message}`;
	}
}
