import { EnterpriseMember } from '@app/entities/enterpriseMember';
import { TypeOrmEnterpriseMemberEntity } from '../entities/enterpriseMember.entity';
import { TEnterpriseMemberInObject } from '@app/mapper/enterpriseMember';
import { CPF } from '@app/entities/VO';

export class TypeOrmEnterpriseMemberMapper {
	static toTypeOrm(input: EnterpriseMember): TypeOrmEnterpriseMemberEntity {
		const member = new TypeOrmEnterpriseMemberEntity();
		member.id = input.id.value;
		member.condominium = input.condominiumId.value;
		member.user = input.userId.value;
		member.CPF = input.CPF.value;
		member.updatedAt = input.updatedAt;
		member.createdAt = input.createdAt;

		return member;
	}

	static toClass(input: TypeOrmEnterpriseMemberEntity): EnterpriseMember {
		return new EnterpriseMember(
			{
				CPF: CPF.toString(parseInt(input.CPF)),
				createdAt: input.createdAt,
				userId: String(input.user),
				updatedAt: input.updatedAt,
				condominiumId: String(input.condominium),
			},
			input.id,
		);
	}

	static toObject(
		input: TypeOrmEnterpriseMemberEntity,
	): TEnterpriseMemberInObject {
		return {
			id: input.id,
			condominiumId: input.condominium as string,
			userId: input.user as string,
			CPF: CPF.toString(parseInt(input.CPF)),
			updatedAt: input.updatedAt,
			createdAt: input.createdAt,
		};
	}
}
