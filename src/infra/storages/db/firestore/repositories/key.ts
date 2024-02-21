import { KeyRepo, KeyCache, KeysEnum } from '@app/repositories/key';
import { FirestoreService } from '../firestore.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { firestoreKeyDTO } from '../dto/keys.DTO';
import { Key } from '@app/entities/key';
import { FirestoreKeyMapper, IToFlatReturn } from '../mapper/key';
import { FirestoreCustomError, FirestoreCustomErrorTag } from '../error';
import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';

@Injectable()
export class FirestoreKey implements KeyRepo, OnModuleInit {
	constructor(
		private readonly firestore: FirestoreService,
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
	];

	private buildErr(name: string) {
		const err = new FirestoreCustomError({
			tag: FirestoreCustomErrorTag.entityDoesntExist,
			cause: `A chave com o nome "${name}" não foi encontrada`,
			message: `"${name}" não foi encontrado`,
		});
		this.loggerAdapter.fatal({
			name: err.name,
			layer: LayersEnum.database,
			description: `${err.message} - ${err.cause}`,
		});

		return err;
	}

	async watchSignatures(): Promise<void> {
		const database = await this.firestore.getInstance();
		const signaturesCollection = database.collection('secrets');

		this.signatures.forEach(async (name) => {
			return new Promise((resolve, reject) => {
				let isFirstTime = true;
				const eventId = setTimeout(() => {
					reject(this.buildErr(name));
				}, 5000);

				signaturesCollection.doc(name).onSnapshot(async (item) => {
					this.loggerAdapter.info({
						name: 'Dynamic signatures',
						layer: LayersEnum.database,
						description: `Lendo a assinatura "${name}" e sincronizando com o sistema de cache interno`,
					});

					if (!item.exists) throw this.buildErr(name);

					const rawData = item.data();
					const incompleteKey = firestoreKeyDTO(
						rawData,
						this.loggerAdapter,
					);
					const key = {
						name: item.id,
						...incompleteKey,
					} as IToFlatReturn;

					await this.keyRepoAsCache.set(
						FirestoreKeyMapper.fromFlatToClass(key),
					);

					if (isFirstTime) {
						clearTimeout(eventId);
						isFirstTime = false;
					}

					return resolve();
				});
			});
		});
	}

	async getSignature(name: KeysEnum): Promise<Key> {
		const key = await this.keyRepoAsCache.get(name);
		if (!key) {
			const err = new FirestoreCustomError({
				tag: FirestoreCustomErrorTag.entityDoesntExist,
				cause: `A chave com o nome "${name}" não foi encontrada`,
				message: `"${name}" não foi encontrado`,
			});

			this.loggerAdapter.fatal({
				name: err.name,
				layer: LayersEnum.database,
				description: `${err.message} - ${err.cause}`,
			});

			throw err;
		}

		return key;
	}

	async onModuleInit() {
		await this.watchSignatures();
	}
}
