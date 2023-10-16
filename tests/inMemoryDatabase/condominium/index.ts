import { Condominium } from '@app/entities/condominium';
import { EntitiesEnum } from '@app/entities/entities';
import {
	CondominiumRepo,
	ICreateCondominiumInput,
} from '@app/repositories/condominium';
import { InMemoryError } from '@tests/errors/inMemoryError';

export class InMemoryCondominium implements CondominiumRepo {
	public condominiums: Condominium[] = [];

	public async create(input: ICreateCondominiumInput): Promise<void> {
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
}
