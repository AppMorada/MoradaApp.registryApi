import { User } from '@registry:app/entities/user';

export abstract class Auth {
	abstract genToken(user: User): Promise<string>;
	abstract throwTFA(user: User): Promise<void>;
	abstract validate(token: string): Promise<boolean>;
}
