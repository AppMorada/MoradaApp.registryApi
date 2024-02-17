import { Key } from '@app/entities/key';
import { KeyCache, KeysEnum } from '@app/repositories/key';
import { InMemoryContainer } from '../inMemoryContainer';

export class InMemoryKeyCache implements KeyCache {
	calls = {
		set: 0,
		delete: 0,
		get: 0,
	};
	keys: Key[];

	constructor(container: InMemoryContainer) {
		this.keys = container.props.keyCacheArr;
	}

	async set(key: Key): Promise<void> {
		++this.calls.set;

		const searchedKeyIndex = this.keys.findIndex(
			(item) => item.name === key.name,
		);
		if (searchedKeyIndex >= 0) {
			this.keys[searchedKeyIndex] = key;
		}

		this.keys.push(key);
	}

	async delete(name: KeysEnum): Promise<void> {
		++this.calls.delete;

		const searchedKeyIndex = this.keys.findIndex(
			(item) => item.name === name.toString(),
		);
		if (searchedKeyIndex >= 0) this.keys.splice(searchedKeyIndex, 1);
	}

	async get(name: KeysEnum): Promise<Key | undefined> {
		++this.calls.get;

		const searchedKey = this.keys.find(
			(item) => item.name === name.toString(),
		);
		return searchedKey;
	}
}
