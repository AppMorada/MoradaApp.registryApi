import { EntitiesEnum } from '@app/entities/entities';
import { User } from '@app/entities/user';
import { ICreateUserInput, UserRepo } from '@app/repositories/user';
import { InMemoryError } from '@tests/errors/inMemoryError';

export class InMemoryUser implements UserRepo {
	public users: User[] = [];

	public async create(input: ICreateUserInput): Promise<void> {
		const existentData = this.users.find((item) =>
			input.user.equalTo(item),
		);

		if (existentData)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User already exist',
			});

		this.users.push(input.user);
	}
}
