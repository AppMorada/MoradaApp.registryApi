import { CondominiumMember } from '@app/entities/condominiumMember';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';
import { ICondominiumMemberInObject } from '@app/mapper/condominiumMember';

export class TypeOrmCondominiumMemberMapper {
	static toTypeOrm(input: CondominiumMember): TypeOrmCondominiumMemberEntity {
		const member = new TypeOrmCondominiumMemberEntity();
		member.id = input.id.value;
		member.c_email = input.c_email.value;
		member.CPF = input.CPF.value;
		member.block = input.block?.value ?? null;
		member.autoEdit = input.autoEdit ? 1 : 0;
		member.apartmentNumber = input.apartmentNumber?.value ?? null;
		member.condominium = input.condominiumId.value;
		member.user = input.userId?.value ?? null;
		member.updatedAt = input.updatedAt;
		member.createdAt = input.createdAt;

		return member;
	}

	static toClass(input: TypeOrmCondominiumMemberEntity): CondominiumMember {
		return new CondominiumMember(
			{
				autoEdit: Boolean(input.autoEdit),
				apartmentNumber: input.apartmentNumber,
				block: input.block,
				CPF: input.CPF,
				c_email: input.c_email,
				createdAt: input.createdAt,
				userId: input.user ? String(input.user) : undefined,
				updatedAt: input.updatedAt,
				condominiumId: String(input.condominium),
			},
			input.id,
		);
	}

	static toObject(
		input: TypeOrmCondominiumMemberEntity,
	): ICondominiumMemberInObject {
		return {
			id: input.id,
			condominiumId: input.condominium as string,
			userId: (input.user as string) ?? undefined,
			c_email: input.c_email,
			CPF: input.CPF,
			block: input.block,
			apartmentNumber: input.apartmentNumber,
			autoEdit: Boolean(input.autoEdit),
			updatedAt: input.updatedAt,
			createdAt: input.createdAt,
		};
	}
}
