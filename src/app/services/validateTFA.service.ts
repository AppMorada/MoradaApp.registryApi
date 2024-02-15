import { Injectable } from '@nestjs/common';
import { IService } from './_IService';
import { GetKeyService } from './getKey.service';
import { KeysEnum } from '@app/repositories/key';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { Key } from '@app/entities/key';
import { User } from '@app/entities/user';
import { CryptAdapter } from '@app/adapters/crypt';
import { generateStringCodeContent } from '@utils/generateStringCodeContent';

interface IProps {
	name: KeysEnum;
	code: string;
	user: User;
}

@Injectable()
export class ValidateTFAService implements IService {
	constructor(
		private readonly getKey: GetKeyService,
		private readonly crypt: CryptAdapter,
	) {}

	private validateNecessaryFields(token: string) {
		const metadata = token.split('.')[0];
		let decodedMetadata: any;

		try {
			decodedMetadata = JSON.parse(decodeURIComponent(atob(metadata)));
		} catch (err) {
			throw new ServiceErrors({
				message: 'Código de dois fatores malformado',
				tag: ServiceErrorsTags.unauthorized,
			});
		}

		const iat = decodedMetadata?.iat;
		const exp = decodedMetadata?.exp;

		if (typeof iat !== 'number' || typeof exp !== 'number')
			throw new ServiceErrors({
				message:
					'O código de autenticação de dois fatores precisa ter os campos "iat" e "exp"',
				tag: ServiceErrorsTags.unauthorized,
			});

		return { iat, exp };
	}

	private async checkCode(
		key: Key,
		token: string,
		user: User,
		state: 'OK' | 'DEPREACATED',
	) {
		const metadata = token.split('.')[0];
		const code = generateStringCodeContent({
			email: user.email,
			id: user.id,
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
		{ code, user }: IProps,
	): Promise<{ sigState: 'DEPREACATED' }> {
		const sigState = 'DEPREACATED';
		const buildedAtFloor = Math.floor(key.prev!.buildedAt / 1000);

		if (buildedAtFloor > iat)
			throw new ServiceErrors({
				message: 'Código expirado',
				tag: ServiceErrorsTags.unauthorized,
			});

		await this.checkCode(key, code, user, sigState);
		return { sigState };
	}

	private async handleNewerSignatures(
		key: Key,
		{ code, user }: IProps,
	): Promise<{ sigState: 'OK' }> {
		const sigState = 'OK';
		await this.checkCode(key, code, user, sigState);
		return { sigState };
	}

	async exec(input: IProps): Promise<{ sigState: 'OK' | 'DEPREACATED' }> {
		const timestamp = this.validateNecessaryFields(input.code);

		const { key } = await this.getKey.exec({ name: input.name });
		const buildedAtFloor = Math.floor(key.actual.buildedAt / 1000);

		if (
			key?.prev &&
			timestamp.iat < buildedAtFloor &&
			timestamp.exp * 1000 > Date.now()
		)
			return await this.handleDepreacatedSignatures(
				key,
				timestamp.iat,
				input,
			);

		if (
			timestamp.iat >= buildedAtFloor &&
			timestamp.exp * 1000 > Date.now()
		)
			return await this.handleNewerSignatures(key, input);

		throw new ServiceErrors({
			message: 'Código expirado',
			tag: ServiceErrorsTags.unauthorized,
		});
	}
}
