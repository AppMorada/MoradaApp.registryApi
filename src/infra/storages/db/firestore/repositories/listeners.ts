import { Injectable } from '@nestjs/common';

@Injectable()
export class FirestoreListeners {
	private unsubscribelistenersFunc: Array<() => void> = [];

	get() {
		return this.unsubscribelistenersFunc;
	}
}
