import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { Key } from '@app/entities/key';
import { KeyCache, KeyRepo, KeysEnum } from '@app/repositories/key';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';

@Injectable()
export class IsolatedKeyRepo implements KeyRepo, OnModuleInit {
	constructor(
		private readonly loggerAdapter: LoggerAdapter,
		private readonly keyRepoAsCache: KeyCache,
	) {}

	private signatures = [
		KeysEnum.ACCESS_TOKEN_KEY.toString(),
		KeysEnum.REFRESH_TOKEN_KEY.toString(),
		KeysEnum.INVITE_TOKEN_KEY.toString(),
		KeysEnum.INVITE_ADMIN_TOKEN_KEY.toString(),
		KeysEnum.INVITE_SUPER_ADMIN_TOKEN_KEY.toString(),
		KeysEnum.TFA_TOKEN_KEY.toString(),
		KeysEnum.CONDOMINIUM_VALIDATION_KEY.toString(),
		KeysEnum.CHANGE_PASSWORD_KEY.toString(),
	];

	async onModuleInit() {
		const promises: Promise<void>[] = [];

		this.signatures.forEach((name) => {
			const key = new Key({
				name,
				ttl: Date.now() + 1000 * 60 * 60 * 24 * 30,
				actual: {
					content: randomBytes(100).toString('hex'),
					buildedAt: Date.now(),
				},
			});

			promises.push(this.keyRepoAsCache.set(key));
		});

		await Promise.all(promises);
	}

	async getSignature(name: KeysEnum): Promise<Key> {
		const key = await this.keyRepoAsCache.get(name);
		if (!key) {
			const err = new DatabaseCustomError({
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
				message: `A chave com o nome "${name}" não foi encontrada`,
			});

			this.loggerAdapter.fatal({
				name: err.name,
				layer: LayersEnum.database,
				description: err.message,
			});

			throw err;
		}

		return key;
	}
}
