import { Invite } from '@app/entities/invite';
import { TypeOrmInviteEntity } from '../entities/invite.entity';
import { TInviteInObject } from '@app/mapper/invite';

export class TypeOrmInviteMapper {
	static toTypeOrm(input: Invite): TypeOrmInviteEntity {
		const invite = new TypeOrmInviteEntity();
		invite.recipient = input.recipient.value;
		invite.code = input.code;
		invite.createdAt = input.createdAt;
		invite.condominium = input.condominiumId.value;
		invite.member = input.memberId.value;

		return invite;
	}

	static toClass(input: TypeOrmInviteEntity): Invite {
		return new Invite({
			condominiumId: input.condominium,
			memberId: input.member,
			recipient: input.recipient,
			code: input.code,
			createdAt: input.createdAt,
		});
	}

	static toObject(input: TypeOrmInviteEntity): TInviteInObject {
		return {
			recipient: input.recipient,
			code: input.code,
			createdAt: input.createdAt,
			condominiumId: input.condominium,
			memberId: input.member,
		};
	}
}
