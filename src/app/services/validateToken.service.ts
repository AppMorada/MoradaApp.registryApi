import { Injectable } from '@nestjs/common';
import { IService } from './_IService';
import { JwtService } from '@nestjs/jwt';
import { GetKeyService } from './getKey.service';
import { KeysEnum } from '@app/repositories/key';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { Key } from '@app/entities/key';

interface IProps {
	name: KeysEnum;
	token: string;
}

@Injectable()
export class ValidateTokenService implements IService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly getKey: GetKeyService,
	) {}

	private validateNecessaryFields(token: string) {
		const decodedToken = this.jwtService.decode(token);
		const iat = decodedToken?.iat;
		const exp = decodedToken?.exp;

		if (typeof iat !== 'number' || typeof exp !== 'number')
			throw new ServiceErrors({
				message: 'O token precisa ter os campos "iat" e "exp"',
				tag: ServiceErrorsTags.unauthorized,
			});

		return { iat, exp, decodedToken };
	}

	private async handleDepreacatedSignatures(
		key: Key,
		iat: number,
		token: string,
	): Promise<{ sigState: 'DEPREACATED' }> {
		const buildedAtFloor = Math.floor(key.prev!.buildedAt / 1000);
		if (buildedAtFloor > iat)
			throw new ServiceErrors({
				message: 'Token expirado',
				tag: ServiceErrorsTags.unauthorized,
			});

		const signatureContent = key!.prev!.content;

		await this.jwtService
			.verifyAsync(token, { secret: signatureContent })
			.catch(() => {
				throw new ServiceErrors({
					message: 'JWT inválido',
					tag: ServiceErrorsTags.unauthorized,
				});
			});

		return { sigState: 'DEPREACATED' };
	}

	private async handleNewerSignatures(
		key: Key,
		token: string,
	): Promise<{ sigState: 'OK' }> {
		const signatureContent = key.actual.content;

		await this.jwtService
			.verifyAsync(token, { secret: signatureContent })
			.catch(() => {
				throw new ServiceErrors({
					message: 'JWT inválido',
					tag: ServiceErrorsTags.unauthorized,
				});
			});

		return { sigState: 'OK' };
	}

	async exec(
		input: IProps,
	): Promise<{ sigState: 'OK' | 'DEPREACATED'; decodedToken: any }> {
		const { iat, decodedToken } = this.validateNecessaryFields(input.token);

		const { key } = await this.getKey.exec({ name: input.name });
		const buildedAtFloor = Math.floor(key.actual.buildedAt / 1000);

		if (key?.prev && iat < buildedAtFloor) {
			const { sigState } = await this.handleDepreacatedSignatures(
				key,
				iat,
				input.token,
			);
			return { sigState, decodedToken };
		}

		if (iat >= buildedAtFloor) {
			const { sigState } = await this.handleNewerSignatures(
				key,
				input.token,
			);
			return { sigState, decodedToken };
		}

		throw new ServiceErrors({
			message: 'Token expirado',
			tag: ServiceErrorsTags.unauthorized,
		});
	}
}
