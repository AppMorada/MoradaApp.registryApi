import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class GooglePubSubService extends PubSub {
	constructor() {
		super();
	}
}
