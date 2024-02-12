import { CEP, CNPJ, UUID, Name } from '@app/entities/VO';
import { Condominium } from '@app/entities/condominium';
import { EntitiesEnum } from '@app/entities/entities';
import {
	CondominiumInterfaces,
	CondominiumRepo,
} from '@app/repositories/condominium';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryContainer } from '../inMemoryContainer';

export class InMemoryCondominium implements CondominiumRepo {
	public calls = {
		create: 0,
		find: 0,
	};
	public condominiums: Condominium[];

	constructor(container: InMemoryContainer) {
		this.condominiums = container.props.condominiumArr;
	}

	public async create(input: CondominiumInterfaces.create): Promise<void> {
		++this.calls.create;

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

	async find(input: CondominiumInterfaces.safeSearch): Promise<Condominium>;
	async find(
		input: CondominiumInterfaces.search,
	): Promise<Condominium | undefined>;

	public async find(
		input: CondominiumInterfaces.search,
	): Promise<Condominium | undefined> {
		++this.calls.find;

		const existentData = this.condominiums.find((item) => {
			return (
				(input.key instanceof CNPJ && item.CNPJ.equalTo(input.key)) ||
				(input.key instanceof CEP && item.CEP.equalTo(input.key)) ||
				(input.key instanceof Name && item.name.equalTo(input.key)) ||
				(input.key instanceof UUID && item.id.equalTo(input.key))
			);
		});

		if (!existentData && input.safeSearch)
			throw new InMemoryError({
				entity: EntitiesEnum.condominium,
				message: 'Condominium not found',
			});

		return existentData;
	}
}
