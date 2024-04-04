import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_ID, EventsTypes } from '@infra/events/ids';
import { EnvEnum, GetEnvService } from '@infra/configs/env/getEnv.service';
import { Condominium } from '@app/entities/condominium';

interface ISendInviteProps {
	condominium: Condominium;
	recipient: string;
}

@Injectable()
export class SendInviteService implements IService {
	constructor(
		private readonly eventEmitter: EventEmitter2,
		private readonly getEnv: GetEnvService,
	) {}

	async exec(input: ISendInviteProps) {
		const { env: PROJECT_NAME } = await this.getEnv.exec({
			env: EnvEnum.PROJECT_NAME,
		});

		const payload: EventsTypes.Email.ISendProps = {
			to: input.recipient,
			subject: `${PROJECT_NAME} - Convite para o condomínio`,
			body: `<h1>Seja bem-vindo!</h1>
			<p>O seu nome acabou de ser registrado na base dados de um condomínio</p>
			<p>${input.condominium.humanReadableId}</p>`,
		};
		this.eventEmitter.emit(EVENT_ID.EMAIL.SEND, payload);
	}
}
