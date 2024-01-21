import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { OTPRepo } from '@registry:app/repositories/otp';
import { OTPRedisService } from './repositories/OTP.service';
import { RedisHealthIndicator } from './healthIndicator';

@Global()
@Module({
	providers: [
		RedisHealthIndicator,
		RedisService,
		{
			provide: OTPRepo,
			useClass: OTPRedisService,
		},
	],
	exports: [OTPRepo, RedisHealthIndicator, RedisService],
})
export class RedisModule {}
