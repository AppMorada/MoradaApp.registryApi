import { EntitiesEnum } from '@app/entities/entities';
import { Key } from '@app/entities/key';
import { KeyRepo, KeysEnum } from '@app/repositories/key';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { randomBytes } from 'crypto';
import { InMemoryContainer } from '../inMemoryContainer';

export class InMemoryKey implements KeyRepo {
	calls = {
		create: 0,
		updateSignatures: 0,
		watchSignatures: 0,
		getSignature: 0,
	};

	keys: Array<{ name: string; value: Key }>;

	constructor(container: InMemoryContainer) {
		this.keys = container.props.keyArr;
	}

	async create(key: Key) {
		++this.calls.create;

		const searchedKey = this.keys.find((item) => item.name === key.name);

		if (searchedKey)
			throw new InMemoryError({
				entity: EntitiesEnum.key,
				message: 'This entity already exist',
			});

		this.keys.push({ name: key.name, value: key });
	}

	async updateSignatures() {
		++this.calls.updateSignatures;

		this.keys = this.keys.map((item) => {
			const value = new Key({
				actual: {
					content: randomBytes(100).toString('hex'),
					buildedAt: Date.now(),
				},
				prev: { ...item.value.actual },
				name: item.name,
				ttl: item.value.ttl,
				id: item.value.id,
				renewTime: item.value.renewTime,
			});

			return { name: item.name, value };
		});
	}

	async watchSignatures(): Promise<void> {
		++this.calls.watchSignatures;
	}

	async getSignature(name: KeysEnum): Promise<Key> {
		++this.calls.getSignature;

		const key = this.keys.find((item) => {
			return item.name === name.toString();
		});

		if (!key)
			throw new InMemoryError({
				entity: EntitiesEnum.key,
				message: 'This entity doesn\'t exist',
			});

		return key.value;
	}
}
