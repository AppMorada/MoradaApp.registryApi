import { EntitieError } from '@app/errors/entities';
import { UUID } from './index';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';

export class UUIDGroup implements ValueObject<UUIDGroup, Set<string>> {
	private _value: Set<string>;

	constructor(input: Iterable<string>) {
		for (const item of input) {
			if (!UUID.check(item))
				throw new EntitieError({
					message:
						'A coleção de números de identificação possui valores incorretos',
					entity: EntitiesEnum.vo,
				});
		}

		this._value = new Set<string>(input);
	}

	private find(input: Set<string>, value: string): boolean {
		let wasFinded = false;
		input.forEach((item: string) => {
			if (item === value) wasFinded = true;
		});

		return wasFinded;
	}

	private comparator(
		toBeIterated: Set<string>,
		toBeSearched: Set<string>,
	): boolean {
		const iterable = toBeIterated.values();
		let data: IteratorResult<string, any> = iterable.next();
		while (!data.done && data.value) {
			const result = this.find(toBeSearched, data.value);
			if (!result) return false;

			data = iterable.next();
		}
		return true;
	}

	equalTo(input: UUIDGroup): boolean {
		if (this.value === input.value) return true;

		if (this.value.size !== input.value.size) return false;

		return this.comparator(this.value, input.value);
	}

	get value() {
		return this._value;
	}
}
