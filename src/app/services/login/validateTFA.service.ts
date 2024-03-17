import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { GetKeyService } from '../key/getKey.service';
import { KeysEnum } from '@app/repositories/key';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { Key } from '@app/entities/key';
import { User } from '@app/entities/user';
import { CryptAdapter } from '@app/adapters/crypt';
import { generateStringCodeContentBasedOnUser } from '@utils/generateStringCodeContent';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

interface IProps {
	name: KeysEnum;
	code: string;
	user: User;
	uniqueRegistry: UniqueRegistry;
}

@Injectable()
export class ValidateTFAService implements IService {
	constructor(
		private readonly getKey: GetKeyService,
		private readonly crypt: CryptAdapter,
	) {}

	private validateNecessaryFields(token: string) {
		const metadata = token.split('.')[0];
		const decodedMetadata = JSON.parse(decodeURIComponent(atob(metadata)));

		const iat = decodedMetadata?.iat;
		const exp = decodedMetadata?.exp;
		const email = decodedMetadata?.sub;

		if (
			typeof iat !== 'number' ||
			typeof exp !== 'number' ||
			typeof email !== 'string'
		)
			throw new ServiceErrors({
				message:
					'O código de autenticação de dois fatores precisa ter os campos "iat", "exp" e "sub"',
				tag: ServiceErrorsTags.unauthorized,
			});

		return { iat, exp, email };
	}

	private async checkCode(
		key: Key,
		token: string,
		user: User,
		uniqueRegistry: UniqueRegistry,
		state: 'OK' | 'DEPREACATED',
	) {
		const metadata = token.split('.')[0];
		const code = generateStringCodeContentBasedOnUser({
			user,
			uniqueRegistry,
		});

		const signature = await this.crypt.hashWithHmac({
			data: encodeURIComponent(
				`${metadata}.${btoa(code)}`.replaceAll('=', ''),
			),
			key: state === 'OK' ? key.actual.content : key!.prev!.content,
		});

		const codeToValidate = encodeURIComponent(
			`${metadata}.${btoa(signature)}`.replaceAll('=', ''),
		);

		if (codeToValidate !== token)
			throw new ServiceErrors({
				message: 'Código inválido',
				tag: ServiceErrorsTags.unauthorized,
			});
	}

	private async handleDepreacatedSignatures(
		key: Key,
		iat: number,
		{ code, user, uniqueRegistry }: IProps,
	): Promise<{ sigState: 'DEPREACATED' }> {
		const sigState = 'DEPREACATED';
		const buildedAtFloor = Math.floor(key.prev!.buildedAt / 1000);

		if (buildedAtFloor > iat)
			throw new ServiceErrors({
				message: 'Código expirado',
				tag: ServiceErrorsTags.unauthorized,
			});

		await this.checkCode(key, code, user, uniqueRegistry, sigState);
		return { sigState };
	}

	private async handleNewerSignatures(
		key: Key,
		{ code, user, uniqueRegistry }: IProps,
	): Promise<{ sigState: 'OK' }> {
		const sigState = 'OK';
		await this.checkCode(key, code, user, uniqueRegistry, sigState);
		return { sigState };
	}

	async exec(
		input: IProps,
	): Promise<{ sigState: 'OK' | 'DEPREACATED'; email: string }> {
		const fields = this.validateNecessaryFields(input.code);

		const { key } = await this.getKey.exec({ name: input.name });
		const buildedAtFloor = Math.floor(key.actual.buildedAt / 1000);

		if (
			key?.prev &&
			fields.iat < buildedAtFloor &&
			fields.exp * 1000 > Date.now()
		) {
			const { sigState } = await this.handleDepreacatedSignatures(
				key,
				fields.iat,
				input,
			);
			return { sigState, email: fields.email };
		}

		if (fields.iat >= buildedAtFloor && fields.exp * 1000 > Date.now()) {
			const { sigState } = await this.handleNewerSignatures(key, input);
			return { sigState, email: fields.email };
		}

		throw new ServiceErrors({
			message: 'Código expirado',
			tag: ServiceErrorsTags.unauthorized,
		});
	}
}
