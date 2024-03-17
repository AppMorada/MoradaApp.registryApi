import { User } from '../entities/user';

export interface IUserInObject {
	id?: string;
	uniqueRegistryId?: string;
	name: string;
	password: string;
	phoneNumber?: string | null;
	tfa: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export type TUserClassToObject = {
	id: string;
	uniqueRegistryId: string;
	name: string;
	password: string;
	phoneNumber?: string | null;
	tfa: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export class UserMapper {
	static toClass({ ...input }: IUserInObject): User {
		return new User(
			{
				...input,
				createdAt: input.createdAt,
				updatedAt: input.updatedAt,
			},
			input.id,
		);
	}

	static toObject(input: User): TUserClassToObject {
		return {
			id: input.id.value,
			uniqueRegistryId: input.uniqueRegistryId.value,
			name: input.name.value,
			password: input.password.value,
			phoneNumber: input.phoneNumber
				? input.phoneNumber.value
				: input.phoneNumber,
			tfa: input.tfa,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		};
	}
}
