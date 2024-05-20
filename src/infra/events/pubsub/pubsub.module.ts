import { Module } from '@nestjs/common';
import { GooglePubSubService } from './google/pubsub.service';
import { DeleteUserPublisher } from '@app/publishers/deleteUser';
import { DeleteUserGooglePublisher } from './google/publishers/deleteUser';
import { DeleteMemberPublisher } from '@app/publishers/deleteMember';
import { DeleteMemberGooglePublisher } from './google/publishers/deleteMember';
import { DeleteCondominiumPublisher } from '@app/publishers/deleteCondominium';
import { DeleteCondominiumGooglePublisher } from './google/publishers/deleteCondominium';

@Module({
	providers: [
		GooglePubSubService,
		{
			provide: DeleteUserPublisher,
			useClass: DeleteUserGooglePublisher,
		},
		{
			provide: DeleteMemberPublisher,
			useClass: DeleteMemberGooglePublisher,
		},
		{
			provide: DeleteCondominiumPublisher,
			useClass: DeleteCondominiumGooglePublisher,
		},
	],
})
export class PubSubModule {}
