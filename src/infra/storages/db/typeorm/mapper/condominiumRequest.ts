import { CondominiumRequest } from '@app/entities/condominiumRequest';
import { TypeOrmCondominiumRequestEntity } from '../entities/condominiumRequest.entity';
import { TCondominiumRequestInObject } from '@app/mapper/condominiumRequest';

export class TypeOrmCondominiumRequestMapper {
	static toTypeOrm(
		input: CondominiumRequest,
	): TypeOrmCondominiumRequestEntity {
		const requestEntity = new TypeOrmCondominiumRequestEntity();
		requestEntity.createdAt = input.createdAt;
		requestEntity.condominium = input.condominiumId.value;
		requestEntity.message = input.message ?? null;
		requestEntity.user = input.userId.value;
		requestEntity.uniqueRegistry = input.uniqueRegistryId.value;

		return requestEntity;
	}

	static toClass(input: TypeOrmCondominiumRequestEntity): CondominiumRequest {
		return new CondominiumRequest({
			condominiumId: String(input.condominium),
			userId: String(input.user),
			uniqueRegistryId: String(input.uniqueRegistry),
			message: input.message ?? null,
			createdAt: input.createdAt,
		});
	}

	static toObject(
		input: TypeOrmCondominiumRequestEntity,
	): TCondominiumRequestInObject {
		return {
			createdAt: input.createdAt,
			condominiumId: String(input.condominium),
			uniqueRegistryId: String(input.uniqueRegistry),
			userId: String(input.user),
			message: input.message ?? null,
		};
	}
}
