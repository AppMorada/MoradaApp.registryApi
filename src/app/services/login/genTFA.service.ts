import { CryptAdapter } from '@app/adapters/crypt';
import { Email, UUID } from '@app/entities/VO';
import { Injectable } from '@nestjs/common';
import { UserRepoReadOps } from '@app/repositories/user/read';
import { generateStringCodeContentBasedOnUser } from '@utils/generateStringCodeContent';
import { IService } from '../_IService';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_ID, EventsTypes } from '@infra/events/ids';
import { GetKeyService } from '../key/getKey.service';
import { KeysEnum } from '@app/repositories/key';
import { EnvEnum, GetEnvService } from '@infra/configs/env/getEnv.service';
import { User } from '@app/entities/user';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

interface INonCachedProps {
	searchUserKey: UUID | Email;
	existentUserContent?: undefined;
	keyName?: KeysEnum;
}

interface ICachedProps {
	searchUserKey?: undefined;
	existentUserContent: { user: User; uniqueRegistry: UniqueRegistry };
	keyName?: KeysEnum;
}

type IProps = INonCachedProps | ICachedProps;

@Injectable()
export class GenTFAService implements IService {
	constructor(
		private readonly userRepo: UserRepoReadOps,
		private readonly crypt: CryptAdapter,
		private readonly eventEmitter: EventEmitter2,
		private readonly getKey: GetKeyService,
		private readonly getEnv: GetEnvService,
	) {}

	private async searchUser(input: UUID | Email) {
		const user = await this.userRepo.find({
			key: input,
			safeSearch: true,
		});
		return user;
	}

	private async genCode(
		user: User,
		uniqueRegistry: UniqueRegistry,
		keyName: KeysEnum = KeysEnum.TFA_TOKEN_KEY,
	) {
		let code = generateStringCodeContentBasedOnUser({
			uniqueRegistry,
			user,
		});
		const { key } = await this.getKey.exec({
			name: keyName,
		});

		const metadata = JSON.stringify({
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor((Date.now() + key.ttl) / 1000),
			sub: uniqueRegistry.email.value,
		});
		code = encodeURIComponent(
			`${btoa(metadata)}.${btoa(code)}`.replaceAll('=', ''),
		);

		const inviteSignature = await this.crypt.hashWithHmac({
			data: code,
			key: key.actual.content,
		});
		return encodeURIComponent(
			`${btoa(metadata)}.${btoa(inviteSignature)}`.replaceAll('=', ''),
		);
	}

	async exec(input: IProps): Promise<{ code: string }>;
	async exec(input: ICachedProps): Promise<{ code: string }>;

	async exec(input: IProps): Promise<{ code: string }> {
		const userContainer =
			input?.existentUserContent ??
			(await this.searchUser(input.searchUserKey));

		const code = await this.genCode(
			userContainer.user,
			userContainer.uniqueRegistry,
			input.keyName,
		);

		const { env: FRONT_END_AUTH_URL } = await this.getEnv.exec({
			env: EnvEnum.FRONT_END_AUTH_URL,
		});
		const { env: PROJECT_NAME } = await this.getEnv.exec({
			env: EnvEnum.PROJECT_NAME,
		});

		const payload: EventsTypes.Email.ISendProps = {
			to: userContainer.uniqueRegistry.email.value,
			subject: `${PROJECT_NAME} - Confirmação de conta`,
			body: `<p>Não compartilhe este código com ninguém</p>
				<a href="${FRONT_END_AUTH_URL}${code}">${FRONT_END_AUTH_URL}${code}</a>`,
		};
		this.eventEmitter.emit(EVENT_ID.EMAIL.SEND, payload);

		return { code };
	}
}
