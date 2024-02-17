export class ConfigError extends Error {
	constructor(input: string) {
		super();

		this.name = 'Config Error';
		this.message = input;
	}
}
