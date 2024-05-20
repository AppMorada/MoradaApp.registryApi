import { UUID } from '@app/entities/VO';
import { CommunityMemberReadOps } from '@app/repositories/communityMember/read';
import { CommunityMemberWriteOps } from '@app/repositories/communityMember/write';
import { IService } from '@app/services/_IService';
import { EVENT_ID, EventsTypes } from '@infra/events/ids';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface IProps {
	id: string;
}

@Injectable()
export class RemoveCommunityMemberService implements IService {
	constructor(
		private readonly memberRepoRemove: CommunityMemberWriteOps.Remove,
		private readonly memberRepoGet: CommunityMemberReadOps.GetById,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async exec(input: IProps) {
		const id = new UUID(input.id);
		const memberWrapper = await this.memberRepoGet.exec({ id });
		if (!memberWrapper) return;

		await this.memberRepoRemove.exec({ id });
		const deletedAt = new Date();

		const message: EventsTypes.PubSub.IDeleteMemberProps = {
			uniqueRegistry: memberWrapper.uniqueRegistry,
			deletedAt,
		};
		this.eventEmitter.emit(EVENT_ID.PUBSUB.DELETE_MEMBER, message);
	}
}
