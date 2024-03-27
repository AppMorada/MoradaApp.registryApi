import { CEP, CNPJ, UUID, Name } from '@app/entities/VO';
import { Condominium } from '@app/entities/condominium';
import { EntitiesEnum } from '@app/entities/entities';
import {
	CondominiumReadOpsInterfaces,
	CondominiumRepoReadOps,
} from '@app/repositories/condominium/read';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryContainer } from '../../inMemoryContainer';
import { User } from '@app/entities/user';
import { CondominiumMember } from '@app/entities/condominiumMember';
import {
	CondominiumMapper,
	TCondominiumInObject,
} from '@app/mapper/condominium';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

export class InMemoryCondominiumReadOps implements CondominiumRepoReadOps {
	calls = {
		find: 0,
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

	async getCondominiumsByOwnerId(
		input: CondominiumReadOpsInterfaces.getCondominiumsByOwnerId,
	): Promise<Required<Required<TCondominiumInObject>>[]> {
		++this.calls.getCondominiumsByOwnerId;
		const searchedData = this.condominiums.filter((item) =>
			item.ownerId.equalTo(input.id),
		);
		return searchedData.map((item) => CondominiumMapper.toObject(item));
	}

	async find(
		input: CondominiumReadOpsInterfaces.safeSearch,
	): Promise<Condominium>;
	async find(
		input: CondominiumReadOpsInterfaces.search,
	): Promise<Condominium | undefined>;

	async find(
		input: CondominiumReadOpsInterfaces.search,
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
