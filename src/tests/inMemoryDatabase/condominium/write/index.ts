import { Condominium } from '@app/entities/condominium';
import { EntitiesEnum } from '@app/entities/entities';
import {
	CondominiumWriteOpsInterfaces,
	CondominiumRepoWriteOps,
} from '@app/repositories/condominium/write';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryContainer } from '../../inMemoryContainer';
import { User } from '@app/entities/user';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

export class InMemoryCondominiumWriteOps implements CondominiumRepoWriteOps {
	calls = {
		create: 0,
		remove: 0,
		update: 0,
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

	async remove(input: CondominiumWriteOpsInterfaces.remove): Promise<void> {
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

	async update(input: CondominiumWriteOpsInterfaces.update): Promise<void> {
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

	async create(input: CondominiumWriteOpsInterfaces.create): Promise<void> {
		++this.calls.create;

		const existentCondominium = this.condominiums.find((item) =>
			input.condominium.equalTo(item),
		);

		if (existentCondominium)
			throw new InMemoryError({
				entity: EntitiesEnum.condominium,
				message: 'Condominium already exist',
			});

		const condominiumMember = new CondominiumMember({
			userId: input.user.id.value,
			role: 2,
			condominiumId: input.condominium.id.value,
			uniqueRegistryId: input.user.uniqueRegistryId.value,
		});

		this.condominiumMembers.push(condominiumMember);
		this.condominiums.push(input.condominium);
	}
}
