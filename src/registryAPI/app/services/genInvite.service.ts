import { CryptAdapter } from '@registry:app/adapters/crypt';
import { Email, Level, UUID } from '@registry:app/entities/VO';
import { Injectable } from '@nestjs/common';
import { generateStringCodeContent } from '@registry:utils/generateStringCodeContent';
import { Invite } from '@registry:app/entities/invite';
import { InviteRepo } from '@registry:app/repositories/invite';
import { IService } from './_IService';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_ID, EventsTypes } from '@registry:infra/events/ids';
import {
	ServiceErrors,
	ServiceErrorsTags,
} from '@registry:app/errors/services';
import { mapInviteKeyBasedOnLevel } from '@registry:utils/mapInviteKeyBasedOnLevel';

interface IProps {
	email: Email;
	condominiumId: UUID;
	requiredLevel?: Level;
	key?: string;
}

/** Serviço responsável por criar um convite */
@Injectable()
export class GenInviteService implements IService {
	constructor(
		private readonly cryptAdapter: CryptAdapter,
		private readonly inviteRepo: InviteRepo,
		private readonly eventEmitter: EventEmitter2,
	) {}

	private async generateInvite({
		invite,
		key,
	}: {
		invite: Invite;
		key: string;
	}) {
		const inputData = generateStringCodeContent({
			id: invite.id,
			email: invite.email,
			requiredLevel: invite.type,
			condominiumId: invite.condominiumId,
		});

		return await this.cryptAdapter.hashWithHmac({ key, data: inputData });
	}

	private sendEmail(input: Pick<IProps, 'email'> & { inviteAsHash: string }) {
		const frontendUrl = String(process.env.FRONT_END_INVITE_URL);
		const payload: EventsTypes.Email.ISendProps = {
			to: input.email.value,
			subject: `${process.env.PROJECT_NAME} - Convite para o condomínio`,
			body: `<h1>Seja bem-vindo!</h1>
				<p>Não compartilhe este link com ninguém</p>
				<a href="${frontendUrl}${input.inviteAsHash}">${frontendUrl}${input.inviteAsHash}</a>`,
		};
		this.eventEmitter.emit(EVENT_ID.EMAIL.SEND, payload);
	}

	async exec(input: IProps) {
		const invite = new Invite({
			email: input.email.value,
			condominiumId: input.condominiumId.value,
			type: input.requiredLevel?.value ?? 0,
			ttl: 1000 * 60 * 60 * 24 * 7,
		});
		const inviteAsHash = await this.generateInvite({
			invite,
			key: input.key ?? (process.env.INVITE_TOKEN_KEY as string),
		});

		await this.inviteRepo.create({ invite });
		this.sendEmail({ email: input.email, inviteAsHash });

		return { invite, hashedValue: inviteAsHash };
	}

	async reexec(input: { email: Email }) {
		// Faria sentido renovar o tempo de expiração do convite?
		// Haja visto que esta ações não está mais no controle dos administradores.

		const invite = await this.inviteRepo.find({
			key: input.email,
			safeSearch: true,
		});
		const issuedAt = invite.expiresAt.getTime() - invite.ttl;
		if (Date.now() < issuedAt + 1000 * 30)
			throw new ServiceErrors({
				message:
					'Convite não pode ser enviado novamente caso o mesmo tenha sido criado a menos de 30 segundos',
				tag: ServiceErrorsTags.unauthorized,
			});

		const key = mapInviteKeyBasedOnLevel(invite.type.value);
		const inviteAsHash = await this.generateInvite({ invite, key });

		this.sendEmail({ email: input.email, inviteAsHash });

		return invite;
	}
}
