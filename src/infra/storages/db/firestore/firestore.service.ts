import {
	Injectable,
	OnApplicationShutdown,
	OnModuleDestroy,
} from '@nestjs/common';
import { initializeApp } from 'firebase-admin/app';
import { Firestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';
import { EnvEnum, GetEnvService } from '@infra/configs/env/getEnv.service';
import { FirestoreListeners } from './repositories/listeners';

@Injectable()
export class FirestoreService
implements OnModuleDestroy, OnApplicationShutdown
{
	private _instance?: Firestore;

	constructor(
		private readonly listeners: FirestoreListeners,
		private readonly getEnv: GetEnvService,
	) {
		this.connect();
	}

	async connect() {
		await this.getEnv
			.exec({ env: EnvEnum.GCP_PROJECT })
			.then(({ env: GCP_PROJECT }) => {
				initializeApp({
					projectId: GCP_PROJECT,
				});

				this._instance = admin.firestore();
				this._instance.settings({
					ignoreUndefinedProperties: true,
				});
			});
	}

	async getInstance(): Promise<Firestore> {
		if (!this._instance) await this.connect();
		return this._instance as Firestore;
	}

	async onModuleDestroy() {
		this.listeners.get().forEach((item) => item());
		await this._instance?.terminate();
	}

	async onApplicationShutdown() {
		this.listeners.get().forEach((item) => item());
		await this._instance?.terminate();
	}
}
