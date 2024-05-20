import { Inject, Injectable } from '@nestjs/common';
import { GooglePubSubService } from '../pubsub.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_ID } from '@infra/events/ids';
import {
	DeleteCondominiumPublisher,
	IDeleteCondominiumProps,
} from '@app/publishers/deleteCondominium';
import { CondominiumMapper } from '@app/mapper/condominium';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class DeleteCondominiumGooglePublisher
implements DeleteCondominiumPublisher
{
	constructor(
		private readonly pubSubService: GooglePubSubService,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	private readonly topicName = 'delete_condominium';

	@OnEvent(EVENT_ID.PUBSUB.DELETE_CONDOMINIUM, { async: true })
	async publish(input: IDeleteCondominiumProps): Promise<void> {
		const tracer = this.trace.getTracer(EVENT_ID.TRACE.PUBSUB);
		const span = tracer.startSpan(`topic: ${this.topicName}`);

		const topic = this.pubSubService.topic(this.topicName);
		const topicExist = await topic.exists();
		if (process.env.NODE_ENV !== 'production' || !topicExist[0]) {
			span.setAttribute('published', 'false');
			return span.end();
		}

		const condominium = CondominiumMapper.toObject(input.condominium);
		const data = Buffer.from(
			JSON.stringify({
				condominium,
				deletedAt: input.deletedAt,
			}),
		);
		await topic.publishMessage({ data });

		span.setAttribute('published', 'true');
		span.end();
	}
}
