import { KeyRepo, KeyCache, KeysEnum } from '@app/repositories/key';
import { FirestoreService } from '../firestore.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { firestoreKeyDTO } from '../dto/keys.DTO';
import { Key } from '@app/entities/key';
import { FirestoreKeyMapper, IToFlatReturn } from '../mapper/key';
import { FirestoreCustomError, FirestoreCustomErrorTag } from '../error';
import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { DocumentData, DocumentSnapshot } from 'firebase-admin/firestore';
import { FirestoreListeners } from './listeners';

@Injectable()
export class FirestoreKey implements KeyRepo, OnModuleInit {
	constructor(
		private readonly listeners: FirestoreListeners,
		private readonly firestore: FirestoreService,
		private readonly loggerAdapter: LoggerAdapter,
		private readonly keyRepoAsCache: KeyCache,
	) {}

	private signatures = [
		KeysEnum.ACCESS_TOKEN_KEY,
		KeysEnum.REFRESH_TOKEN_KEY,
		KeysEnum.INVITE_TOKEN_KEY,
		KeysEnum.INVITE_ADMIN_TOKEN_KEY,
		KeysEnum.INVITE_SUPER_ADMIN_TOKEN_KEY,
		KeysEnum.TFA_TOKEN_KEY,
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

	async getAndCache(name: string, item: DocumentSnapshot<DocumentData>) {
		if (!item.exists) throw this.buildErr(name);

		const rawData = item.data();
		const incompleteKey = firestoreKeyDTO(rawData, this.loggerAdapter);
		const flatKey = {
			name: item.id,
			...incompleteKey,
		} as IToFlatReturn;

		const key = FirestoreKeyMapper.fromFlatToClass(flatKey);
		await this.keyRepoAsCache.set(key);

		return key;
	}

	async watchSignatures(): Promise<void> {
		const database = await this.firestore.getInstance();
		const signaturesCollection = database.collection('secrets');

		for (const signature of this.signatures) {
			const name = signature.toString();

			const remoteSignature = await signaturesCollection.doc(name).get();
			await this.getAndCache(name, remoteSignature);

			const listener = signaturesCollection
				.doc(name)
				.onSnapshot(async (item) => {
					await this.getAndCache(name, item);
				});
			this.listeners.get().push(listener);
		}
	}

	async getSignature(name: KeysEnum): Promise<Key> {
		const key = await this.keyRepoAsCache.get(name);
		if (key) return key;

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

	async onModuleInit() {
		await this.watchSignatures();
	}
}
