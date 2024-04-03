import { CommunityInfos } from '@app/entities/communityInfos';
import { TypeOrmCommunityInfosEntity } from '../entities/communityInfos.entity';
import { ICommunityInfoAsObject } from '@app/mapper/communityInfo';

export class TypeOrmCommunityInfoMapper {
	static toTypeOrm(input: CommunityInfos): TypeOrmCommunityInfosEntity {
		const info = new TypeOrmCommunityInfosEntity();
		info.member = input.memberId.value;
		info.apartmentNumber = input.apartmentNumber?.value ?? null;
		info.block = input.block?.value ?? null;
		info.updatedAt = input.updatedAt;

		return info;
	}

	static toClass(input: TypeOrmCommunityInfosEntity): CommunityInfos {
		return new CommunityInfos({
			memberId: input.member,
			block: input.block,
			apartmentNumber: input.apartmentNumber,
			updatedAt: input.updatedAt,
		});
	}

	static toObject(
		input: TypeOrmCommunityInfosEntity,
	): ICommunityInfoAsObject {
		return {
			memberId: input.member,
			apartmentNumber: input.apartmentNumber,
			block: input.block,
			updatedAt: input.updatedAt,
		};
	}
}
