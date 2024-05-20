import {
	DeleteUserPublisher,
	IDeleteUserProps,
} from '@app/publishers/deleteUser';
import { Injectable } from '@nestjs/common';
import { GooglePubSubService } from '../pubsub.service';
import { UserMapper } from '@app/mapper/user';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_ID } from '@infra/events/ids';
import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';

@Injectable()
export class DeleteUserGooglePublisher implements DeleteUserPublisher {
	constructor(private readonly pubSubService: GooglePubSubService) {}

	private readonly topicName = 'delete_user';

	@OnEvent(EVENT_ID.PUBSUB.DELETE_USER, { async: true })
	async publish(input: IDeleteUserProps): Promise<void> {
		const topic = this.pubSubService.topic(this.topicName);
		if (process.env.NODE_ENV !== 'production' || !topic.exists()) return;

		const user = UserMapper.toObject(input.user) as any;
		delete user.password;

		const uniqueRegistry = UniqueRegistryMapper.toObject(
			input.uniqueRegistry,
		);

		await topic.publishMessage({
			json: {
				user,
				uniqueRegistry,
				deletedAt: input.deletedAt,
			},
		});
	}
}
