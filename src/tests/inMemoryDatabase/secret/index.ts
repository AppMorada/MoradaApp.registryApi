import { Secret } from '@app/entities/secret';
import { SecretRepo } from '@app/repositories/secret';
import { InMemoryContainer } from '../inMemoryContainer';

export class InMemorySecret implements SecretRepo {
	secrets: Secret[];
	calls = {
		add: 0,
		delete: 0,
		get: 0,
	};

	constructor(private readonly container: InMemoryContainer) {
		this.secrets = this.container.props.secretArr;
	}

	async add(input: Secret): Promise<void> {
		++this.calls.add;

		const searchedSecretIndex = this.secrets.findIndex(
			(item) => item.key === input.key,
		);
		if (searchedSecretIndex >= 0) this.secrets[searchedSecretIndex] = input;

		this.secrets.push(input);
	}

	async delete(key: string): Promise<void> {
		++this.calls.delete;

		const searchedSecretIndex = this.secrets.findIndex(
			(item) => item.key === key,
		);
		if (searchedSecretIndex < 0) return;

		this.secrets.splice(searchedSecretIndex, 1);
	}

	async get(key: string): Promise<Secret | undefined> {
		++this.calls.get;

		const searchedSecret = this.secrets.find((item) => item.key === key);
		return searchedSecret ?? undefined;
	}
}
