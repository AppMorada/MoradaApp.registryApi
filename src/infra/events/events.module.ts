import { Global, Module } from '@nestjs/common';
import { InternalEventsModule } from './internals/internals.module';
import { PubSubModule } from './pubsub/pubsub.module';

@Global()
@Module({
	imports: [InternalEventsModule, PubSubModule],
})
export class EventsModule {}
