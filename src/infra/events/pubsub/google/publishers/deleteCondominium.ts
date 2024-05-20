import { Injectable } from '@nestjs/common';
import { GooglePubSubService } from '../pubsub.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_ID } from '@infra/events/ids';
import {
	DeleteCondominiumPublisher,
	IDeleteCondominiumProps,
} from '@app/publishers/deleteCondominium';
import { CondominiumMapper } from '@app/mapper/condominium';

@Injectable()
export class DeleteCondominiumGooglePublisher
implements DeleteCondominiumPublisher
{
	constructor(private readonly pubSubService: GooglePubSubService) {}

	private readonly topicName = 'delete_condominium';

	@OnEvent(EVENT_ID.PUBSUB.DELETE_CONDOMINIUM, { async: true })
	async publish(input: IDeleteCondominiumProps): Promise<void> {
		const topic = this.pubSubService.topic(this.topicName);
		if (process.env.NODE_ENV !== 'production' || !topic.exists()) return;

		const condominium = CondominiumMapper.toObject(input.condominium);
		await topic.publishMessage({
			json: { condominium, deletedAt: input.deletedAt },
		});
	}
}
