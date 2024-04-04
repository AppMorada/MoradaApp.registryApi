import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumRules } from '@app/entities/_rules/condominium';

export class State implements ValueObject<State, string> {
	constructor(private readonly _value: string) {
		if (
			this._value.length < condominiumRules.state.minLength ||
			this._value.length > condominiumRules.state.maxLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto do estado',
			});
	}

	public equalTo(input: State) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
