import { Invite } from '@app/entities/invite';
import { TypeOrmInviteEntity } from '../entities/invite.entity';
import { TInviteInObject } from '@app/mapper/invite';

export class TypeOrmInviteMapper {
	static toTypeOrm(input: Invite): TypeOrmInviteEntity {
		const invite = new TypeOrmInviteEntity();
		invite.id = input.id.value;
		invite.recipient = input.recipient.value;
		invite.code = input.code;
		invite.createdAt = input.createdAt;
		invite.condominium = input.condominiumId.value;
		invite.member = input.memberId.value;

		return invite;
	}

	static toClass(input: TypeOrmInviteEntity): Invite {
		return new Invite(
			{
				condominiumId: input.condominium as string,
				memberId: input.member as string,
				recipient: input.recipient,
				code: input.code,
				createdAt: input.createdAt,
			},
			input.id,
		);
	}

	static toObject(input: TypeOrmInviteEntity): TInviteInObject {
		return {
			id: input.id,
			recipient: input.recipient,
			code: input.code,
			createdAt: input.createdAt,
			condominiumId: input.condominium as string,
			memberId: input.member as string,
		};
	}
}
