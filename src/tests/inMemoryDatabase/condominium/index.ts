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
import { EnterpriseMember } from '@app/entities/enterpriseMember';
import {
	CondominiumMapper,
	TCondominiumInObject,
} from '@app/mapper/condominium';

export class InMemoryCondominium implements CondominiumRepo {
	public calls = {
		create: 0,
		find: 0,
		remove: 0,
		update: 0,
		getCondominiumsByOwnerId: 0,
	};
	public condominiums: Condominium[];
	public users: User[];
	public condominiumMembers: CondominiumMember[];
	public enterpriseMembers: EnterpriseMember[];

	constructor(container: InMemoryContainer) {
		this.condominiums = container.props.condominiumArr;
		this.users = container.props.userArr;
		this.condominiumMembers = container.props.condominiumMemberArr;
		this.enterpriseMembers = container.props.enterpriseMemberArr;
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

		this.condominiums.splice(existentDataIndex, 1);

		const condominium = this.condominiums[existentDataIndex];
		this.condominiumMembers.filter((item) =>
			item.condominiumId.equalTo(condominium.id),
		);

		for (const enterpriseMember of this.enterpriseMembers) {
			const userIndex = this.users.findIndex((item) =>
				item.id.equalTo(enterpriseMember.userId),
			);
			this.users.splice(userIndex, 1);
		}
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

		if (existentUser || existentCondominium)
			throw new InMemoryError({
				entity: EntitiesEnum.condominium,
				message: 'Condominium already exist',
			});

		this.condominiums.push(input.condominium);
		this.users.push(input.user);
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
