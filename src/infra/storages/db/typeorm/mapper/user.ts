import { CPF } from '@app/entities/VO';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { User } from '@app/entities/user';
import { TUserClassToObject } from '@app/mapper/user';

export class TypeOrmUserMapper {
	static toTypeOrm(input: User): TypeOrmUserEntity {
		const user = new TypeOrmUserEntity();
		user.id = input.id.value;
		user.name = input.name.value;
		user.email = input.email.value;
		user.password = input.password.value;
		user.CPF = input.CPF.value;
		user.phoneNumber = input.phoneNumber ? input.phoneNumber.value : null;
		user.createdAt = input.createdAt;
		user.updatedAt = input.updatedAt;

		return user;
	}

	static toClass(input: TypeOrmUserEntity): User {
		const cpfAsInt = CPF.toInt(new CPF(input.CPF));
		const cpfAsString = CPF.toString(cpfAsInt);
		return new User(
			{
				name: input.name,
				email: input.email,
				password: input.password,
				phoneNumber: input.phoneNumber,
				tfa: Boolean(input.tfa),
				CPF: cpfAsString,
				updatedAt: input.updatedAt,
				createdAt: input.createdAt,
			},
			input.id,
		);
	}

	static toObject(input: TypeOrmUserEntity): TUserClassToObject {
		const cpfAsInt = CPF.toInt(new CPF(input.CPF));
		const cpfAsString = CPF.toString(cpfAsInt);
		return {
			id: input.id,
			email: input.email,
			name: input.name,
			CPF: cpfAsString,
			password: input.password,
			tfa: Boolean(input.tfa),
			phoneNumber: input.phoneNumber,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		};
	}
}
