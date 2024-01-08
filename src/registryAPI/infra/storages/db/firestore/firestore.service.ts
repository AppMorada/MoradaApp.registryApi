import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { initializeApp } from 'firebase-admin/app';
import { Firestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';

@Injectable()
export class FirestoreService implements OnApplicationShutdown {
	private readonly _instance: Firestore;

	constructor() {
		initializeApp({
			projectId: process.env.GCP_PROJECT,
		});

		this._instance = admin.firestore();
		this._instance.settings({
			ignoreUndefinedProperties: true,
		});
	}

	get instance(): Firestore {
		return this._instance;
	}

	async close() {
		await this._instance.terminate();
	}

	async onApplicationShutdown() {
		await this._instance.terminate();
	}
}
