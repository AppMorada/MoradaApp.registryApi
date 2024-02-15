import { KeyRepo, KeysEnum } from '@app/repositories/key';
import { FirestoreService } from '../firestore.service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { firestoreKeyDTO } from '../dto/keys.DTO';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Key } from '@app/entities/key';
import { FirestoreKeyMapper, IToFlatReturn } from '../mapper/key';
import { FirestoreCustomError, FirestoreCustomErrorTag } from '../error';
import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';

@Injectable()
export class FirestoreKey implements KeyRepo, OnModuleInit {
	constructor(
		private readonly firestore: FirestoreService,
		private readonly loggerAdapter: LoggerAdapter,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
	) {}

	public signaturesCollection = this.firestore.instance.collection('secrets');

	private signatures = [
		KeysEnum.ACCESS_TOKEN_KEY.toString(),
		KeysEnum.REFRESH_TOKEN_KEY.toString(),
		KeysEnum.INVITE_TOKEN_KEY.toString(),
		KeysEnum.INVITE_ADMIN_TOKEN_KEY.toString(),
		KeysEnum.INVITE_SUPER_ADMIN_TOKEN_KEY.toString(),
		KeysEnum.TFA_TOKEN_KEY.toString(),
	];

	async watchSignatures(): Promise<void> {
		this.signatures.forEach((name) => {
			this.signaturesCollection.doc(name).onSnapshot(async (item) => {
				if (!item.exists) {
					const err = new FirestoreCustomError({
						tag: FirestoreCustomErrorTag.entityDoesntExist,
						cause: `A chave com o nome "${name}" não foi encontrada`,
						message: 'Entidade não existe',
					});
					this.loggerAdapter.error({
						name: err.name,
						layer: LayersEnum.database,
						description: err.message,
					});

					throw err;
				}

				const rawData = item.data();
				const incompleteKey = firestoreKeyDTO(
					rawData,
					this.loggerAdapter,
				);
				const key = {
					name: item.id,
					...incompleteKey,
				} as IToFlatReturn;

				const jsonKey = JSON.stringify(key);
				await this.cacheManager.set(name, jsonKey, 0);
			});
		});
	}

	async getSignature(name: KeysEnum): Promise<Key> {
		const rawKey = await this.cacheManager.get<string>(name.toString());
		if (!rawKey) {
			const err = new FirestoreCustomError({
				tag: FirestoreCustomErrorTag.entityDoesntExist,
				cause: `A chave com o nome "${name}" não foi encontrada`,
				message: 'Entidade não existe',
			});

			this.loggerAdapter.error({
				name: err.name,
				layer: LayersEnum.database,
				description: err.message,
			});

			throw err;
		}

		const key = FirestoreKeyMapper.fromFlatToClass(
			JSON.parse(rawKey) as IToFlatReturn,
		);
		return key;
	}

	async onModuleInit() {
		this.watchSignatures();
	}
}
