import { Inject, Injectable } from '@nestjs/common';
import { GooglePubSubService } from '../pubsub.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_ID } from '@infra/events/ids';
import {
	DeleteMemberPublisher,
	IDeleteMemberProps,
} from '@app/publishers/deleteMember';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class DeleteMemberGooglePublisher implements DeleteMemberPublisher {
	constructor(
		private readonly pubSubService: GooglePubSubService,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	private readonly topicName = 'delete_member';

	@OnEvent(EVENT_ID.PUBSUB.DELETE_MEMBER, { async: true })
	async publish(input: IDeleteMemberProps): Promise<void> {
		const tracer = this.trace.getTracer(EVENT_ID.TRACE.PUBSUB);
		const span = tracer.startSpan(`topic: ${this.topicName}`);

		const topic = this.pubSubService.topic(this.topicName);
		const topicExists = await topic.exists();
		if (process.env.NODE_ENV !== 'production' || !topicExists[0]) {
			span.setAttribute('published', 'false');
			return span.end();
		}

		const data = Buffer.from(
			JSON.stringify({
				uniqueRegistry: input.uniqueRegistry,
				deletedAt: input.deletedAt,
			}),
		);
		await topic.publishMessage({ data });

		span.setAttribute('published', 'true');
		span.end();
	}
}
