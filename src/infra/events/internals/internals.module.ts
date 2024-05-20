import { AdaptersModule } from '@app/adapters/adapter.module';
import { Module } from '@nestjs/common';
import { EmailEvents } from './emails.service';

@Module({
	imports: [AdaptersModule],
	providers: [EmailEvents],
	exports: [EmailEvents],
})
export class InternalEventsModule {}
