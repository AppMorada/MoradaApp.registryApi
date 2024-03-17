import { PhoneNumber } from '@app/entities/VO';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { User } from '@app/entities/user';
import { TUserClassToObject } from '@app/mapper/user';

export class TypeOrmUserMapper {
	static toTypeOrm(input: User): TypeOrmUserEntity {
		const user = new TypeOrmUserEntity();
		user.id = input.id.value;
		user.name = input.name.value;
		user.uniqueRegistry = input.uniqueRegistryId.value;
		user.password = input.password.value;
		user.phoneNumber = input.phoneNumber ? input.phoneNumber.value : null;
		user.createdAt = input.createdAt;
		user.updatedAt = input.updatedAt;

		return user;
	}

	static toClass(input: TypeOrmUserEntity): User {
		const phoneNumber = input.phoneNumber
			? parseInt(input.phoneNumber)
			: null;
		const parsedPhoneNumber = phoneNumber
			? PhoneNumber.toString(phoneNumber)
			: null;
		return new User(
			{
				name: input.name,
				uniqueRegistryId: String(input.uniqueRegistry),
				password: input.password,
				phoneNumber: parsedPhoneNumber,
				tfa: Boolean(input.tfa),
				updatedAt: input.updatedAt,
				createdAt: input.createdAt,
			},
			input.id,
		);
	}

	static toObject(input: TypeOrmUserEntity): TUserClassToObject {
		const phoneNumber = input.phoneNumber
			? parseInt(input.phoneNumber)
			: null;
		const parsedPhoneNumber = phoneNumber
			? PhoneNumber.toString(phoneNumber)
			: null;
		return {
			id: input.id,
			uniqueRegistryId: String(input.uniqueRegistry),
			name: input.name,
			password: input.password,
			tfa: Boolean(input.tfa),
			phoneNumber: parsedPhoneNumber,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		};
	}
}
