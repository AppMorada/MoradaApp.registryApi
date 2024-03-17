import { Email } from '@app/entities/VO';
import { Injectable } from '@nestjs/common';
import { Invite } from '@app/entities/invite';
import { IService } from '../_IService';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_ID, EventsTypes } from '@infra/events/ids';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';
import { CryptAdapter } from '@app/adapters/crypt';
import { generateRandomNums } from '@utils/generateRandomNums';

export interface IGenInviteProps {
	recipient: string;
	condominiumId: string;
	memberId: string;
	CPF: string;
}

@Injectable()
export class GenInviteService implements IService {
	constructor(
		private readonly eventEmitter: EventEmitter2,
		private readonly cryptAdapter: CryptAdapter,
		private readonly getEnv: GetEnvService,
	) {}

	private async sendEmail(recipient: Email, code: string) {
		const { env: PROJECT_NAME } = await this.getEnv.exec({
			env: EnvEnum.PROJECT_NAME,
		});

		const payload: EventsTypes.Email.ISendProps = {
			to: recipient.value,
			subject: `${PROJECT_NAME} - Convite para o condomínio`,
			body: `<h1>Seja bem-vindo!</h1>
			<p>O seu nome acabou de ser registrado na base dados de um condomínio</p>
			<p>${code}</p>`,
		};
		this.eventEmitter.emit(EVENT_ID.EMAIL.SEND, payload);
	}

	async exec(input: IGenInviteProps) {
		const { env: INVITE_COMPLEXITY_CODE } = await this.getEnv.exec({
			env: EnvEnum.INVITE_COMPLEXITY_CODE,
		});
		const randomNums = generateRandomNums(
			parseInt(INVITE_COMPLEXITY_CODE as string),
		);
		const code = await this.cryptAdapter.hash(`${input.CPF}-${randomNums}`);

		const invite = new Invite({
			recipient: input.recipient,
			condominiumId: input.condominiumId,
			code,
			memberId: input.memberId,
		});

		return {
			invite,
			sendInviteOnEmail: async () =>
				await this.sendEmail(invite.recipient, randomNums),
		};
	}
}
