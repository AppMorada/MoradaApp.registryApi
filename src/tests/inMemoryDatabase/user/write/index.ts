import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { User } from '@app/entities/user';
import {
	UserRepoWriteOps,
	UserRepoWriteOpsInterfaces,
} from '@app/repositories/user/write';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryContainer } from '../../inMemoryContainer';

import { CondominiumMember } from '@app/entities/condominiumMember';
import { Condominium } from '@app/entities/condominium';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { UUID } from '@app/entities/VO';

export class InMemoryUserWriteOps implements UserRepoWriteOps {
	calls = {
		create: 0,
		delete: 0,
		update: 0,
	};
	users: User[];
	condominiums: Condominium[];
	uniqueRegistries: UniqueRegistry[];
	condominiumMembers: CondominiumMember[];

	constructor(container: InMemoryContainer) {
		this.users = container.props.userArr;
		this.uniqueRegistries = container.props.uniqueRegistryArr;
		this.condominiums = container.props.condominiumArr;
		this.condominiumMembers = container.props.condominiumMemberArr;
	}

	async create(
		input: UserRepoWriteOpsInterfaces.create,
	): Promise<UserRepoWriteOpsInterfaces.createReturn> {
		++this.calls.create;

		const existentUserIndex = this.users.findIndex((item) =>
			item.id.equalTo(input.user.id),
		);
		if (existentUserIndex >= 0)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User already exist',
			});

		const existentUniqueRegistryIndex = this.uniqueRegistries.findIndex(
			(item) =>
				ValueObject.compare(
					item.id,
					this.users[existentUserIndex]?.uniqueRegistryId,
				) || item.email.equalTo(input.uniqueRegistry.email),
		);
		if (existentUniqueRegistryIndex < 0)
			this.uniqueRegistries.push(input.uniqueRegistry);

		this.users.push(input.user);

		const condominiumMemberIndex = this.condominiumMembers.findIndex(
			(item) =>
				ValueObject.compare(
					item.uniqueRegistryId,
					this.uniqueRegistries[existentUniqueRegistryIndex]?.id ??
						this.users[existentUserIndex]?.uniqueRegistryId,
				),
		);
		if (condominiumMemberIndex >= 0) {
			const existentCondominiumMember =
				this.condominiumMembers[condominiumMemberIndex];

			existentCondominiumMember.userId = new UUID(input.user.id.value);
			this.condominiumMembers[condominiumMemberIndex] =
				existentCondominiumMember;

			return { affectedCondominiumMembers: 1 };
		}

		return { affectedCondominiumMembers: undefined };
	}

	async delete(input: UserRepoWriteOpsInterfaces.remove): Promise<void> {
		++this.calls.delete;

		const existentUserIndex = this.users.findIndex((item) =>
			item.id.equalTo(input.key),
		);
		const uniqueRegistryIndex = this.uniqueRegistries.findIndex((item) =>
			ValueObject.compare(
				item.id,
				this.users[existentUserIndex]?.uniqueRegistryId,
			),
		);

		if (existentUserIndex < 0 || uniqueRegistryIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User doesn\'t exist',
			});

		this.uniqueRegistries.splice(uniqueRegistryIndex, 1);
		this.users.splice(existentUserIndex, 1);
		this.condominiumMembers = this.condominiumMembers.filter(
			(item) => item.userId?.equalTo(input.key),
		);
	}

	async update(input: UserRepoWriteOpsInterfaces.update): Promise<void> {
		++this.calls.update;

		const existentUserIndex = this.users.findIndex((item) =>
			item.id.equalTo(input.id),
		);

		if (existentUserIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User doesn\'t exist',
			});

		const user = this.users[existentUserIndex];
		user.name = input?.name ?? user.name;
		user.phoneNumber = input?.phoneNumber ?? user.phoneNumber;
	}
}
