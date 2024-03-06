import { UUID, Email } from '@app/entities/VO';
import { EntitiesEnum } from '@app/entities/entities';
import { User } from '@app/entities/user';
import { UserRepo, UserRepoInterfaces } from '@app/repositories/user';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryContainer } from '../inMemoryContainer';

import { CondominiumMember } from '@app/entities/condominiumMember';
import { Invite } from '@app/entities/invite';
import { Condominium } from '@app/entities/condominium';
import { EnterpriseMember } from '@app/entities/enterpriseMember';

export class InMemoryUser implements UserRepo {
	public calls = {
		create: 0,
		find: 0,
		delete: 0,
		update: 0,
	};
	public users: User[];
	public invites: Invite[];
	public condominiums: Condominium[];
	public condominiumMembers: CondominiumMember[];
	public enterpriseMembers: EnterpriseMember[];

	constructor(container: InMemoryContainer) {
		this.users = container.props.userArr;
		this.invites = container.props.inviteArr;
		this.condominiums = container.props.condominiumArr;
		this.condominiumMembers = container.props.condominiumMemberArr;
		this.enterpriseMembers = container.props.enterpriseMemberArr;
	}

	async find(input: UserRepoInterfaces.safeSearch): Promise<User>;
	async find(input: UserRepoInterfaces.search): Promise<User | undefined>;

	async find(
		input: UserRepoInterfaces.search | UserRepoInterfaces.safeSearch,
	): Promise<User | undefined> {
		++this.calls.find;

		const existentData = this.users.find((item) => {
			return (
				(input.key instanceof Email && item.email.equalTo(input.key)) ||
				(input.key instanceof UUID && item.id.equalTo(input.key))
			);
		});

		if (!existentData && input.safeSearch)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User not found',
			});

		return existentData;
	}

	async delete(input: UserRepoInterfaces.remove): Promise<void> {
		++this.calls.delete;

		const existentUserIndex = this.users.findIndex((item) =>
			item.id.equalTo(input.key),
		);

		if (existentUserIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User doesn\'t exist',
			});

		this.condominiumMembers = this.condominiumMembers.filter(
			(item) => item.userId?.equalTo(input.key),
		);
		this.enterpriseMembers = this.enterpriseMembers.filter((item) =>
			item.userId.equalTo(input.key),
		);

		this.users.splice(existentUserIndex, 1);
	}

	async update(input: UserRepoInterfaces.update): Promise<void> {
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
