import { Module } from '@nestjs/common';
import { HttpModule } from './infra/http/http.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
	imports: [
		HttpModule,
		ThrottlerModule.forRoot([
			{
				limit: 6,
				ttl: 2,
			},
		]),
	],
})
export class AppModule {}
