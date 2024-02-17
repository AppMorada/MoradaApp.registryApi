import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailAdapter } from '@app/adapters/email';
import { EVENT_ID, EventsTypes } from './ids';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';

/** Evento responsável por lidar com emails */
@Injectable()
export class EmailEvents {
	constructor(
		private readonly emailAdapter: EmailAdapter,
		private readonly getEnv: GetEnvService,
	) {}

	@OnEvent(EVENT_ID.EMAIL.SEND, { async: true })
	async send(payload: EventsTypes.Email.ISendProps) {
		const { env: EMAIL_SENDER } = await this.getEnv.exec({
			env: EnvEnum.EMAIL_SENDER,
		});
		const { env: NAME_SENDER } = await this.getEnv.exec({
			env: EnvEnum.NAME_SENDER,
		});

		await this.emailAdapter.send({
			from: `${NAME_SENDER} <${EMAIL_SENDER}>`,
			to: payload.to,
			subject: payload.subject,
			body: payload.body,
		});
	}
}
