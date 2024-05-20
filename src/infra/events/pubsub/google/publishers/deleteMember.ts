import { Injectable } from '@nestjs/common';
import { GooglePubSubService } from '../pubsub.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_ID } from '@infra/events/ids';
import {
	DeleteMemberPublisher,
	IDeleteMemberProps,
} from '@app/publishers/deleteMember';

@Injectable()
export class DeleteMemberGooglePublisher implements DeleteMemberPublisher {
	constructor(private readonly pubSubService: GooglePubSubService) {}

	private readonly topicName = 'delete_member';

	@OnEvent(EVENT_ID.PUBSUB.DELETE_MEMBER, { async: true })
	async publish(input: IDeleteMemberProps): Promise<void> {
		const topic = this.pubSubService.topic(this.topicName);
		if (process.env.NODE_ENV !== 'production' || !topic.exists()) return;

		await topic.publishMessage({
			json: {
				uniqueRegistry: input.uniqueRegistry,
				deletedAt: input.deletedAt,
			},
		});
	}
}
