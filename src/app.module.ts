import { Module } from '@nestjs/common';
import { HttpModule } from './infra/http/http.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from '@infra/events/events.module';

@Module({
	imports: [
		HttpModule,
		EventEmitterModule.forRoot({
			wildcard: false,
			delimiter: '.',
			newListener: false,
			removeListener: false,
			maxListeners: 10,
			verboseMemoryLeak: true,
			ignoreErrors: false,
		}),
		EventsModule,
	],
})
export class AppModule {}
