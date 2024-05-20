import { UserWriteOps } from '@app/repositories/user/write';
import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { User } from '@app/entities/user';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_ID, EventsTypes } from '@infra/events/ids';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

interface IProps {
	user: User;
	uniqueRegistry: UniqueRegistry;
}

@Injectable()
export class DeleteUserService implements IService {
	constructor(
		private readonly userRepoDelete: UserWriteOps.Delete,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async exec({ user, uniqueRegistry }: IProps) {
		await this.userRepoDelete.exec({ key: user.id });
		const deletedAt = new Date();

		const message: EventsTypes.PubSub.IDeleteUserProps = {
			user,
			uniqueRegistry,
			deletedAt,
		};
		this.eventEmitter.emit(EVENT_ID.PUBSUB.DELETE_USER, message);
	}
}
