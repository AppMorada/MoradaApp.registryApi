import { CryptAdapter } from '@registry:app/adapters/crypt';
import { EmailAdapter } from '@registry:app/adapters/email';
import { Email, Level, UUID } from '@registry:app/entities/VO';
import { Injectable } from '@nestjs/common';
import { generateStringCodeContent } from '@registry:utils/generateStringCodeContent';
import { Invite } from '@registry:app/entities/invite';
import { InviteRepo } from '@registry:app/repositories/invite';
import { IService } from './_IService';

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
		private readonly emailAdapter: EmailAdapter,
		private readonly inviteRepo: InviteRepo,
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

	async exec(input: IProps): Promise<Invite> {
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
		await this.emailAdapter.send({
			from: `${process.env.NAME_SENDER} <${process.env.EMAIL_SENDER}>`,
			to: input.email.value,
			subject: `${process.env.PROJECT_NAME} - Convite para o condomínio`,
			body: `<h1>Seja bem-vindo!</h1>
				<p>Não compartilhe este link com ninguém</p>
				<a href="#">https://[EXEMPLO DE DOMÍNIO]/[PÁGINA DO FRONT PARA VALIDAR O CONVITE]/${inviteAsHash}</a>`,
		});

		return invite;
	}
}
