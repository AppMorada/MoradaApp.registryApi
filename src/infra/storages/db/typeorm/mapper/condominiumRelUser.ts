import { CondominiumRelUser } from '@app/entities/condominiumRelUser';
import { TypeOrmCondominiumRelUserEntity } from '../entities/condominiumRelUser.entity';
import { TCondominiumRelUserToObject } from '@app/mapper/condominiumRelUser';

export class TypeOrmCondominiumRelUserMapper {
	static toTypeOrm(
		input: CondominiumRelUser,
	): TypeOrmCondominiumRelUserEntity {
		const data = new TypeOrmCondominiumRelUserEntity();
		data.id = input.id.value;
		data.block = input.block?.value ?? null;
		data.level = input.level.value;
		data.apartmentNumber = input.apartmentNumber?.value ?? null;
		data.updatedAt = input.updatedAt;
		data.condominium = input.condominiumId.value;
		data.user = input.userId.value;

		return data;
	}
	static toClass(input: TypeOrmCondominiumRelUserEntity): CondominiumRelUser {
		return new CondominiumRelUser(
			{
				condominiumId: input.condominium as string,
				userId: input.user as string,
				block: input.block,
				level: input.level,
				updatedAt: input.updatedAt,
				apartmentNumber: input.apartmentNumber,
			},
			input.id,
		);
	}

	static toObject(
		input: TypeOrmCondominiumRelUserEntity,
	): TCondominiumRelUserToObject {
		return {
			id: input.id,
			condominiumId: input.condominium as string,
			userId: input.user as string,
			updatedAt: input.updatedAt,
			level: input.level,
			apartmentNumber: input.apartmentNumber,
			block: input.block,
		};
	}
}
