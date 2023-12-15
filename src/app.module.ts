import { Module } from '@nestjs/common';
import { HttpModule } from './infra/http/http.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
	],
})
export class AppModule {}
