import { Invite as InvitePrisma } from '@prisma/client';
import { Invite } from '@registry:app/entities/invite';

export class InvitePrismaMapper {
	/**
	 * Mapeia os dados inseridos e os adapta para a utilização no prisma
	 * @param input - Deve conter os dados de entrada do convite
	 **/
	static toPrisma(input: Invite): InvitePrisma {
		return {
			id: input.id.value,
			expiresAt: input.expiresAt,
			ttl: input.ttl,
			type: input.type.value,
			email: input.email.value,
			condominiumId: input.condominiumId.value,
		};
	}

	/**
	 * Mapeia os dados vindos do prisma em classes
	 * @param input - Deve conter os dados vindos do prisma
	 **/
	static toClass(input: InvitePrisma): Invite {
		return new Invite(
			{
				condominiumId: input.condominiumId,
				email: input.email,
				type: input.type,
				ttl: input.ttl,
				expiresAt: input.expiresAt,
			},
			input.id,
		);
	}
}
