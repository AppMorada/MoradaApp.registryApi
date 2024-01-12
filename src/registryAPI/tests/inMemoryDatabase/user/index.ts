import { CPF, UUID, Email } from '@registry:app/entities/VO';
import { EntitiesEnum } from '@registry:app/entities/entities';
import { User } from '@registry:app/entities/user';
import { UserRepo, UserRepoInterfaces } from '@registry:app/repositories/user';
import { InMemoryError } from '@registry:tests/errors/inMemoryError';
import {
	IInMemoryUserContainer,
	InMemoryContainer,
} from '../inMemoryContainer';
import { CondominiumRelUser } from '@registry:app/entities/condominiumRelUser';
import {
	CondominiumRelUserMapper,
	TCondominiumRelUserToObject,
} from '@registry:app/mapper/condominiumRelUser';

export class InMemoryUser implements UserRepo {
	public calls = {
		create: 0,
		find: 0,
		delete: 0,
		getCondominiumRelation: 0,
		getAllCondominiumRelation: 0,
	};
	public users: IInMemoryUserContainer[];

	constructor(container: InMemoryContainer) {
		this.users = container.props.userArr;
	}

	public async create(input: UserRepoInterfaces.create): Promise<void> {
		++this.calls.create;

		const existentData = this.users.find(
			(item) =>
				input.user.id.equalTo(item.user.content.id) ||
				input.user.email.equalTo(item.user.content.email) ||
				input.user.CPF.equalTo(item.user.content.CPF),
		);

		if (existentData)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User already exist',
			});

		this.users.push({
			user: {
				content: input.user,
				condominiumRelUser: {
					[input.condominiumRelUser.condominiumId.value]:
						input.condominiumRelUser,
				},
			},
		});
	}

	async find(input: UserRepoInterfaces.safeSearch): Promise<User>;
	async find(input: UserRepoInterfaces.search): Promise<User | undefined>;

	public async find(
		input: UserRepoInterfaces.search | UserRepoInterfaces.safeSearch,
	): Promise<User | undefined> {
		++this.calls.find;

		const existentData = this.users.find((item) => {
			return (
				(input.key instanceof Email &&
					item.user.content.email.equalTo(input.key)) ||
				(input.key instanceof CPF &&
					item.user.content.CPF.equalTo(input.key)) ||
				(input.key instanceof UUID &&
					item.user.content.id.equalTo(input.key))
			);
		});

		if (!existentData && input.safeSearch)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User not found',
			});

		return existentData?.user.content;
	}

	async getCondominiumRelation(
		input: UserRepoInterfaces.getCondominiumRelation,
	): Promise<CondominiumRelUser | undefined> {
		++this.calls.getCondominiumRelation;

		const existentData = this.users.find(
			(item) =>
				item.user.content.id === input.userId &&
				item.user.condominiumRelUser[input.condominiumId.value],
		);

		if (!existentData) return undefined;

		return existentData.user.condominiumRelUser[input.condominiumId.value];
	}
	async getAllCondominiumRelation(
		input: UserRepoInterfaces.getAllCondominiumRelation,
	): Promise<TCondominiumRelUserToObject[]> {
		++this.calls.getAllCondominiumRelation;

		const existentUser = this.users.find((item) =>
			item.user.content.id.equalTo(input.userId),
		);

		if (!existentUser) return [];
		const condominiumRelUser: TCondominiumRelUserToObject[] = [];

		for (const key in existentUser.user.condominiumRelUser)
			condominiumRelUser.push(
				CondominiumRelUserMapper.toObject(
					existentUser.user.condominiumRelUser[key],
				),
			);

		return condominiumRelUser;
	}

	public async delete(input: UserRepoInterfaces.remove): Promise<void> {
		++this.calls.delete;

		const existentDataIndex = this.users.findIndex((item) => {
			return (
				(input.key instanceof UUID &&
					item.user.content.id.equalTo(input.key)) ||
				(input.key instanceof Email &&
					item.user.content.email.equalTo(input.key))
			);
		});

		if (existentDataIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User doesn\'t exist',
			});

		this.users.splice(existentDataIndex, 1);
	}
}
