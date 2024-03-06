import { Injectable } from '@nestjs/common';

@Injectable()
export class FirestoreListeners {
	private listeners: Array<() => void> = [];

	get() {
		return this.listeners;
	}
}
