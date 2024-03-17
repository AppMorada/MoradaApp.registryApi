import { CondominiumMember } from '@app/entities/condominiumMember';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';
import { ICondominiumMemberInObject } from '@app/mapper/condominiumMember';

export class TypeOrmCondominiumMemberMapper {
	static toTypeOrm(input: CondominiumMember): TypeOrmCondominiumMemberEntity {
		const member = new TypeOrmCondominiumMemberEntity();
		member.id = input.id.value;
		member.condominium = input.condominiumId.value;
		member.uniqueRegistry = input.uniqueRegistryId.value;
		member.role = input.role.value;
		member.user = input.userId?.value ?? null;
		member.updatedAt = input.updatedAt;
		member.createdAt = input.createdAt;

		return member;
	}

	static toClass(input: TypeOrmCondominiumMemberEntity): CondominiumMember {
		return new CondominiumMember(
			{
				createdAt: input.createdAt,
				userId: input.user ? String(input.user) : null,
				uniqueRegistryId: String(input.uniqueRegistry),
				role: input.role,
				updatedAt: input.updatedAt,
				condominiumId: input.condominium,
			},
			input.id,
		);
	}

	static toObject(
		input: TypeOrmCondominiumMemberEntity,
	): ICondominiumMemberInObject {
		return {
			id: input.id,
			condominiumId: input.condominium,
			uniqueRegistryId: String(input.uniqueRegistry),
			userId: input.user ? String(input.user) : null,
			role: input.role,
			updatedAt: input.updatedAt,
			createdAt: input.createdAt,
		};
	}
}
