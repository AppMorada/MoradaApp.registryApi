import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { CondominiumWriteOps } from '@app/repositories/condominium/write';
import { EVENT_ID, EventsTypes } from '@infra/events/ids';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Condominium } from '@app/entities/condominium';

interface IProps {
	condominium: Condominium;
}

@Injectable()
export class DeleteCondominiumService implements IService {
	constructor(
		private readonly condominiumRepoRemove: CondominiumWriteOps.Remove,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async exec({ condominium }: IProps): Promise<void> {
		await this.condominiumRepoRemove.exec({ id: condominium.id });
		const deletedAt = new Date();

		const message: EventsTypes.PubSub.IDeleteCondominiumProps = {
			condominium,
			deletedAt,
		};
		this.eventEmitter.emit(EVENT_ID.PUBSUB.DELETE_CONDOMINIUM, message);
	}
}
