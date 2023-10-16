import { User } from '@app/entities/user';

export interface ICreateUserInput {
	user: User;
}

export abstract class UserRepo {
	abstract create: (input: ICreateUserInput) => Promise<void>;
}
