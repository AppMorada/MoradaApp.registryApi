import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { EntitieError } from '@app/errors/entities';
import { randomUUID } from 'node:crypto';

export class UUID implements ValueObject<UUID, string> {
	private readonly _value: string;

	constructor(input: string) {
		const regexp =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		if (!input.match(regexp))
			throw new EntitieError({
				message:
					'O número de identificação não está formatado corretamente',
				entity: EntitiesEnum.vo,
			});

		this._value = input;
	}

	static check(input: string): boolean {
		const regexp =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		if (!input.match(regexp)) return false;
		return true;
	}

	static genV4() {
		const uuid = randomUUID();
		return new UUID(uuid);
	}

	equalTo(input: UUID): boolean {
		return this._value === input.value;
	}

	get value(): string {
		return this._value;
	}
}
