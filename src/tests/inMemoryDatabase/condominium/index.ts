import { CEP, CNPJ, UUID, Name } from '@app/entities/VO';
import { Condominium } from '@app/entities/condominium';
import { EntitiesEnum } from '@app/entities/entities';
import {
	CondominiumInterfaces,
	CondominiumRepo,
} from '@app/repositories/condominium';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryContainer } from '../inMemoryContainer';
import { User } from '@app/entities/user';
import { CondominiumMember } from '@app/entities/condominiumMember';
import {
	CondominiumMapper,
	TCondominiumInObject,
} from '@app/mapper/condominium';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

export class InMemoryCondominium implements CondominiumRepo {
	calls = {
		create: 0,
		find: 0,
		remove: 0,
		update: 0,
		getCondominiumsByOwnerId: 0,
	};

	condominiums: Condominium[];
	users: User[];
	condominiumMembers: CondominiumMember[];
	uniqueRegistries: UniqueRegistry[];

	constructor(container: InMemoryContainer) {
		this.condominiums = container.props.condominiumArr;
		this.users = container.props.userArr;
		this.condominiumMembers = container.props.condominiumMemberArr;
		this.uniqueRegistries = container.props.uniqueRegistryArr;
	}

	async remove(input: CondominiumInterfaces.remove): Promise<void> {
		++this.calls.remove;

		const existentDataIndex = this.condominiums.findIndex((item) =>
			item.id.equalTo(input.id),
		);
		if (existentDataIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.condominium,
				message: 'Condominium doesn\'t exist',
			});

		const condominium = this.condominiums[existentDataIndex];
		this.condominiumMembers = this.condominiumMembers.filter(
			(item) => !item.condominiumId.equalTo(condominium.id),
		);

		this.condominiums.splice(existentDataIndex, 1);
	}

	async update(input: CondominiumInterfaces.update): Promise<void> {
		++this.calls.update;

		const existentDataIndex = this.condominiums.findIndex((item) =>
			item.id.equalTo(input.id),
		);
		if (existentDataIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.condominium,
				message: 'Condominium doesn\'t exist',
			});

		const condominium = this.condominiums[existentDataIndex];
		condominium.CEP = input.CEP ?? condominium.CEP;
		condominium.name = input.name ?? condominium.name;
		condominium.num = input.num ?? condominium.num;
	}

	async create(input: CondominiumInterfaces.create): Promise<void> {
		++this.calls.create;

		const existentCondominium = this.condominiums.find((item) =>
			input.condominium.equalTo(item),
		);
		const existentUser = this.users.find((item) =>
			item.id.equalTo(input.user.id),
		);
		const uniqueRegistry = this.uniqueRegistries.find((item) =>
			item.email.equalTo(input.uniqueRegistry.email),
		);

		if (existentUser || existentCondominium || uniqueRegistry)
			throw new InMemoryError({
				entity: EntitiesEnum.condominium,
				message: 'Condominium already exist',
			});

		this.uniqueRegistries.push(input.uniqueRegistry);
		this.users.push(input.user);
		this.condominiums.push(input.condominium);
	}

	async getCondominiumsByOwnerId(
		input: CondominiumInterfaces.getCondominiumsByOwnerId,
	): Promise<Required<Required<TCondominiumInObject>>[]> {
		++this.calls.getCondominiumsByOwnerId;
		const searchedData = this.condominiums.filter((item) =>
			item.ownerId.equalTo(input.id),
		);
		return searchedData.map((item) => CondominiumMapper.toObject(item));
	}

	async find(input: CondominiumInterfaces.safeSearch): Promise<Condominium>;
	async find(
		input: CondominiumInterfaces.search,
	): Promise<Condominium | undefined>;

	async find(
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
