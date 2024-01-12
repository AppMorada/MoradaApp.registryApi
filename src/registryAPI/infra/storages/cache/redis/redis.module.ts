import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { OTPRepo } from '@registry:app/repositories/otp';
import { OTPRedisService } from './repositories/OTP.service';

@Global()
@Module({
	providers: [
		RedisService,
		{
			provide: OTPRepo,
			useClass: OTPRedisService,
		},
	],
	exports: [OTPRepo],
})
export class RedisModule {}
