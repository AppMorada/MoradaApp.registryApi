import { CryptAdapter } from '@app/adapters/crypt';
import { Email, Level, UUID } from '@app/entities/VO';
import { Injectable } from '@nestjs/common';
import { generateStringCodeContent } from '@utils/generateStringCodeContent';
import { Invite } from '@app/entities/invite';
import { InviteRepo } from '@app/repositories/invite';
import { IService } from './_IService';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_ID, EventsTypes } from '@infra/events/ids';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { mapInviteKeyBasedOnLevel } from '@utils/mapInviteKeyBasedOnLevel';
import { GetKeyService } from './getKey.service';
import { KeysEnum } from '@app/repositories/key';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';

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
		private readonly getKey: GetKeyService,
		private readonly getEnv: GetEnvService,
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

	private async sendEmail(
		input: Pick<IProps, 'email'> & { inviteAsHash: string },
	) {
		const { env: FRONT_END_INVITE_URL } = await this.getEnv.exec({
			env: EnvEnum.FRONT_END_INVITE_URL,
		});
		const { env: PROJECT_NAME } = await this.getEnv.exec({
			env: EnvEnum.PROJECT_NAME,
		});

		const payload: EventsTypes.Email.ISendProps = {
			to: input.email.value,
			subject: `${PROJECT_NAME} - Convite para o condomínio`,
			body: `<h1>Seja bem-vindo!</h1>
				<p>Não compartilhe este link com ninguém</p>
				<a href="${FRONT_END_INVITE_URL}${input.inviteAsHash}">${FRONT_END_INVITE_URL}${input.inviteAsHash}</a>`,
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
			key:
				input.key ??
				(await this.getKey.exec({ name: KeysEnum.INVITE_TOKEN_KEY }))
					.key.actual.content,
		});

		await this.inviteRepo.create({ invite });
		this.sendEmail({ email: input.email, inviteAsHash });

		return { invite, hashedValue: inviteAsHash };
	}

	async reexec(input: { email: Email }) {
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

		const key = await mapInviteKeyBasedOnLevel(
			invite.type.value,
			this.getKey,
		);
		const inviteAsHash = await this.generateInvite({ invite, key });

		this.sendEmail({ email: input.email, inviteAsHash });

		return invite;
	}
}
