import { Entity } from '../entities';

export interface ISecretProps {
	key: string;
	value: string;
}

export class Secret implements Entity {
	constructor(private readonly input: ISecretProps) {}

	dereference(): Secret {
		return new Secret({
			key: this.key,
			value: this.value,
		});
	}

	equalTo(input: Secret): boolean {
		return (
			input instanceof Secret &&
			input.key === this.key &&
			input.value === this.value
		);
	}

	get key() {
		return this.input.key;
	}
	get value() {
		return this.input.value;
	}
}
