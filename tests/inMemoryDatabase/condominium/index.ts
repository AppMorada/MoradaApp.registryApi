import { Condominium } from '@app/entities/condominium';
import { EntitiesEnum } from '@app/entities/entities';
import {
	CondominiumRepo,
	ICondominiumSearchQuery,
	ICreateCondominiumInput,
} from '@app/repositories/condominium';
import { InMemoryError } from '@tests/errors/inMemoryError';

export class InMemoryCondominium implements CondominiumRepo {
	public calls = {
		create: 0,
		find: 0,
	};
	public condominiums: Condominium[] = [];

	public async create(input: ICreateCondominiumInput): Promise<void> {
		this.calls.create = this.calls.create + 1;

		const existentData = this.condominiums.find((item) =>
			input.condominium.equalTo(item),
		);

		if (existentData)
			throw new InMemoryError({
				entity: EntitiesEnum.condominium,
				message: 'Condominium already exist',
			});

		this.condominiums.push(input.condominium);
	}

	public async find(
		input: ICondominiumSearchQuery,
	): Promise<Condominium | undefined> {
		this.calls.find = this.calls.find + 1;

		const existentData = this.condominiums.find((item) => {
			return (
				(input.CNPJ && item.CNPJ.equalTo(input.CNPJ)) ||
				(input.CEP && item.CEP.equalTo(input.CEP)) ||
				(input.name && item.name.equalTo(input.name)) ||
				(input.id && item.id === input.id)
			);
		});

		return existentData;
	}
}
