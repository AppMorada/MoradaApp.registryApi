import { Invite } from '@app/entities/invite';
import { TypeOrmInviteEntity } from '../entities/invite.entity';
import { TInviteInObject } from '@app/mapper/invite';

export class TypeOrmInviteMapper {
	static toTypeOrm(input: Invite): TypeOrmInviteEntity {
		const invite = new TypeOrmInviteEntity();
		invite.id = input.id.value;
		invite.recipient = input.recipient.value;
		invite.CPF = input.CPF.value;
		invite.createdAt = input.createdAt;
		invite.hierarchy = input.hierarchy.value;
		invite.condominium = input.condominiumId.value;

		return invite;
	}

	static toClass(input: TypeOrmInviteEntity): Invite {
		return new Invite(
			{
				condominiumId: input.condominium as string,
				recipient: input.recipient,
				hierarchy: input.hierarchy,
				CPF: input.CPF,
				createdAt: input.createdAt,
			},
			input.id,
		);
	}

	static toObject(input: TypeOrmInviteEntity): TInviteInObject {
		return {
			id: input.id,
			recipient: input.recipient,
			CPF: input.CPF,
			hierarchy: input.hierarchy,
			createdAt: input.createdAt,
			condominiumId: input.condominium as string,
		};
	}
}
