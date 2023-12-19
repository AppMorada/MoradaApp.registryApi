import { EntitiesEnum } from '@registry:app/entities/entities';
import { User } from '@registry:app/entities/user';
import {
	ICreateUserInput,
	IDeleteUserParameters,
	IUserSearchQuery,
	UserRepo,
} from '@registry:app/repositories/user';
import { InMemoryError } from '@registry:tests/errors/inMemoryError';

export class InMemoryUser implements UserRepo {
	public calls = {
		create: 0,
		find: 0,
		delete: 0,
	};
	public users: User[] = [];

	public async create(input: ICreateUserInput): Promise<void> {
		this.calls.create = this.calls.create + 1;

		const existentData = this.users.find(
			(item) =>
				input.user.id === item.id ||
				input.user.email === item.email ||
				input.user.CPF === item.CPF,
		);

		if (existentData)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User already exist',
			});

		this.users.push(input.user);
	}

	public async find(input: IUserSearchQuery): Promise<User | undefined> {
		this.calls.find = this.calls.find + 1;

		const existentData = this.users.find((item) => {
			return (
				(input.email && item.email.equalTo(input.email)) ||
				(input.CPF && item.CPF.equalTo(input.CPF)) ||
				(input.id && item.id === input.id)
			);
		});

		return existentData;
	}

	public async delete(input: IDeleteUserParameters): Promise<void> {
		this.calls.delete = this.calls.delete + 1;

		const existentDataIndex = this.users.findIndex((item) => {
			return (
				(input.id && item.id === input.id) ||
				(input.email && item.email.equalTo(input.email))
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
