import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailAdapter } from '@app/adapters/email';
import { EVENT_ID, EventsTypes } from './ids';

/** Evento responsável por lidar com emails */
@Injectable()
export class EmailEvents {
	constructor(private readonly emailAdapter: EmailAdapter) {}

	@OnEvent(EVENT_ID.EMAIL.SEND, { async: true })
	async send(payload: EventsTypes.Email.ISendProps) {
		await this.emailAdapter.send({
			from: `${process.env.NAME_SENDER} <${process.env.EMAIL_SENDER}>`,
			to: payload.to,
			subject: payload.subject,
			body: payload.body,
		});
	}
}
