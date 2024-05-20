import { UUID } from '@app/entities/VO';
import { EmployeeMemberReadOps } from '@app/repositories/employeeMember/read';
import { EmployeeMemberWriteOps } from '@app/repositories/employeeMember/write';
import { IService } from '@app/services/_IService';
import { EVENT_ID, EventsTypes } from '@infra/events/ids';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface IProps {
	condominiumId: string;
	userId: string;
}

@Injectable()
export class RemoveEmployeeMemberService implements IService {
	constructor(
		private readonly memberRepoRemove: EmployeeMemberWriteOps.Remove,
		private readonly memberRepoGet: EmployeeMemberReadOps.GetByUserId,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async exec(input: IProps) {
		const userId = new UUID(input.userId);
		const memberWrapper = await this.memberRepoGet.exec({ id: userId });
		if (!memberWrapper) return;

		await this.memberRepoRemove.exec({
			userId,
			condominiumId: new UUID(input.condominiumId),
		});
		const deletedAt = new Date();

		const message: EventsTypes.PubSub.IDeleteMemberProps = {
			uniqueRegistry: memberWrapper.uniqueRegistry,
			deletedAt,
		};
		this.eventEmitter.emit(EVENT_ID.PUBSUB.DELETE_MEMBER, message);
	}
}
