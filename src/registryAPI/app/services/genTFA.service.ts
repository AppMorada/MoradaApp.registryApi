import { CryptAdapter } from '@registry:app/adapters/crypt';
import { Email, UUID } from '@registry:app/entities/VO';
import { Injectable } from '@nestjs/common';
import { UserRepo } from '@registry:app/repositories/user';
import { generateStringCodeContent } from '@registry:utils/generateStringCodeContent';
import { IService } from './_IService';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_ID, EventsTypes } from '@registry:infra/events/ids';

interface IProps {
	email: Email;
	userId: UUID;
}

/** Serviço responsável por iniciar o processo de autenticação de dois fatores */
@Injectable()
export class GenTFAService implements IService {
	constructor(
		private readonly userRepo: UserRepo,
		private readonly crypt: CryptAdapter,
		private readonly eventEmitter: EventEmitter2,
	) {}

	private async genCode(input: UUID) {
		const user = await this.userRepo.find({ key: input, safeSearch: true });
		let code = generateStringCodeContent({
			email: user.email,
			id: user.id,
		});
		const key = process.env.TFA_TOKEN_KEY as string;

		const metadata = JSON.stringify({
			iat: Date.now(),
			exp: Date.now() + 1000 * 60 * 60 * 3,
		});
		code = `${btoa(metadata)}.${btoa(code)}`;

		const inviteSignature = await this.crypt.hashWithHmac({
			data: code,
			key,
		});
		return `${btoa(metadata)}.${btoa(inviteSignature)}`;
	}

	async exec(input: IProps) {
		const code = await this.genCode(input.userId);

		const payload: EventsTypes.Email.ISendProps = {
			to: input.email.value,
			subject: `${process.env.PROJECT_NAME} - Solicitação de login`,
			body: `<h1>Seja bem-vindo!</h1>
				<p>Não compartilhe este código com ninguém</p>
				<a href="#">https://[EXEMPLO DE DOMÍNIO]/[PÁGINA DO FRONT PARA VALIDAR O CÓDIGO]/${code}</a>`,
		};
		this.eventEmitter.emit(EVENT_ID.EMAIL.SEND, payload);

		return { code };
	}
}
