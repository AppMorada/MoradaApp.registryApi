import { Global, Module } from '@nestjs/common';
import { AdaptersModule } from '@registry:app/adapters/adapter.module';
import { EmailEvents } from './emails.service';

@Global()
@Module({
	imports: [AdaptersModule],
	providers: [EmailEvents],
	exports: [EmailEvents],
})
export class EventsModule {}
