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
		requestEntity.user = input.userId.value;

		return requestEntity;
	}

	static toClass(input: TypeOrmCondominiumRequestEntity): CondominiumRequest {
		return new CondominiumRequest({
			condominiumId: input.condominium as string,
			userId: input.user as string,
			createdAt: input.createdAt,
		});
	}

	static toObject(
		input: TypeOrmCondominiumRequestEntity,
	): TCondominiumRequestInObject {
		return {
			createdAt: input.createdAt,
			condominiumId: input.condominium as string,
			userId: input.user as string,
		};
	}
}
