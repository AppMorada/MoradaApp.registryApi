import { Email } from '@app/entities/VO';
import { Injectable } from '@nestjs/common';
import { Invite } from '@app/entities/invite';
import { InviteRepo } from '@app/repositories/invite';
import { IService } from '../_IService';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_ID, EventsTypes } from '@infra/events/ids';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';

interface IProps {
	recipient: string;
	condominiumId: string;
	hierarchy?: number;
	CPF: string;
}

/** Serviço responsável por criar um convite */
@Injectable()
export class GenInviteService implements IService {
	constructor(
		private readonly inviteRepo: InviteRepo,
		private readonly eventEmitter: EventEmitter2,
		private readonly getEnv: GetEnvService,
	) {}

	private async sendEmail(recipient: Email) {
		const { env: PROJECT_NAME } = await this.getEnv.exec({
			env: EnvEnum.PROJECT_NAME,
		});

		const payload: EventsTypes.Email.ISendProps = {
			to: recipient.value,
			subject: `${PROJECT_NAME} - Convite para o condomínio`,
			body: `<h1>Seja bem-vindo!</h1>
			<p>O seu nome acabou de ser registrado na base dados de um condomínio</p>`,
		};
		this.eventEmitter.emit(EVENT_ID.EMAIL.SEND, payload);
	}

	async exec(input: IProps) {
		const invite = new Invite({
			recipient: input.recipient,
			condominiumId: input.condominiumId,
			hierarchy: input.hierarchy ?? 0,
			CPF: input.CPF,
		});

		await this.inviteRepo.create({ invite });
		this.sendEmail(invite.recipient);
	}
}
