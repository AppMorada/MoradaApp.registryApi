import {
	DeleteUserPublisher,
	IDeleteUserProps,
} from '@app/publishers/deleteUser';
import { Inject, Injectable } from '@nestjs/common';
import { GooglePubSubService } from '../pubsub.service';
import { UserMapper } from '@app/mapper/user';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_ID } from '@infra/events/ids';
import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class DeleteUserGooglePublisher implements DeleteUserPublisher {
	constructor(
		private readonly pubSubService: GooglePubSubService,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	private readonly topicName = 'delete_user';

	@OnEvent(EVENT_ID.PUBSUB.DELETE_USER, { async: true })
	async publish(input: IDeleteUserProps): Promise<void> {
		const tracer = this.trace.getTracer(EVENT_ID.TRACE.PUBSUB);
		const span = tracer.startSpan(`topic: ${this.topicName}`);

		const topic = this.pubSubService.topic(this.topicName);
		const topicExists = await topic.exists();
		if (process.env.NODE_ENV !== 'production' || !topicExists[0]) {
			span.setAttribute('published', 'false');
			return span.end();
		}

		const user = UserMapper.toObject(input.user) as any;
		delete user.password;

		const uniqueRegistry = UniqueRegistryMapper.toObject(
			input.uniqueRegistry,
		);

		const data = Buffer.from(
			JSON.stringify({
				user,
				uniqueRegistry,
				deletedAt: input.deletedAt,
			}),
		);
		await topic.publishMessage({ data });

		span.setAttribute('published', 'true');
		span.end();
	}
}
