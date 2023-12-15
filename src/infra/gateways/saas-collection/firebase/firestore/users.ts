import {
	ICreateUserInput,
	IUserSearchQuery,
	UserRepo,
} from '@app/repositories/user';
import { FirebaseInstances } from '..';
import { UserMapper } from '@app/mapper/user';
import { Filter } from 'firebase-admin/firestore';
import { User } from '@app/entities/user';
import { checkClassValidatorErrorsAsPoisonErr } from '@utils/convertValidatorErr';
import { plainToClass } from 'class-transformer';
import { FirestoreGetUserDTO } from '../DTO/getUser';

export class UsersFirestore implements UserRepo {
	constructor() {}

	async create(input: ICreateUserInput): Promise<void> {
		const userInObjt = UserMapper.toObject(input.user);
		await FirebaseInstances.firestore.collection('user').add(userInObjt);
	}

	async find(input: IUserSearchQuery): Promise<User | undefined> {
		const rawUser = await FirebaseInstances.firestore
			.collection('user')
			.where(
				Filter.or(
					Filter.where('id', '==', input.id),
					Filter.where('CPF', '==', input.CPF),
					Filter.where('email', '==', input.email),
				),
			)
			.limit(1)
			.get();

		const schema = plainToClass(FirestoreGetUserDTO, rawUser);
		await checkClassValidatorErrorsAsPoisonErr({ body: schema });

		return undefined;
	}
	async delete(): Promise<void> {}
}
