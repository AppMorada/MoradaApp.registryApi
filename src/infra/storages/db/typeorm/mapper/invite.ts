import { Invite } from '@app/entities/invite';
import { TypeOrmInviteEntity } from '../entities/invite.entity';
import { TInviteInObject } from '@app/mapper/invite';

export class TypeOrmInviteMapper {
	static toTypeOrm(input: Invite): TypeOrmInviteEntity {
		const invite = new TypeOrmInviteEntity();
		invite.id = input.id.value;
		invite.email = input.email.value;
		invite.ttl = input.ttl;
		invite.type = input.type.value;
		invite.expiresAt = input.expiresAt;
		invite.condominium = input.condominiumId.value;

		return invite;
	}

	static toClass(input: TypeOrmInviteEntity): Invite {
		return new Invite(
			{
				condominiumId: input.condominium as string,
				ttl: input.ttl,
				type: input.type,
				email: input.email,
				expiresAt: input.expiresAt,
			},
			input.id,
		);
	}

	static toObject(input: TypeOrmInviteEntity): TInviteInObject {
		return {
			id: input.id,
			email: input.email,
			expiresAt: input.expiresAt,
			type: input.type,
			ttl: input.ttl,
			condominiumId: input.condominium as string,
		};
	}
}
