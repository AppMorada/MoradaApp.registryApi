import { Injectable } from '@nestjs/common';
import {
	ICreateOTPInput,
	IDeleteOTPInput,
	IFindOTPInput,
	OTPRepo,
} from '@app/repositories/otp';
import { RedisService } from '../redis.service';
import { OTPRedisMapper } from '../mapper/otp';
import { RedisErrorsTags, RedisLogicError } from '../error';
import { RedisEnum } from '../redisEnum';
import { OTP } from '@app/entities/OTP';

@Injectable()
export class OTPRedisService implements OTPRepo {
	constructor(private readonly redisService: RedisService) {}

	async create(input: ICreateOTPInput): Promise<void> {
		const redis = await this.redisService.instance();

		const otpObjt = OTPRedisMapper.toRedis(input.otp);

		const res = await redis.set(
			`${RedisEnum.otp}${input.email.value}`,
			JSON.stringify(otpObjt),
			'PX',
			input.otp.ttl ?? 1000 * 60 * 2,
			'NX',
		);

		if (!res)
			throw new RedisLogicError({
				tag: RedisErrorsTags.alreadyExist,
				message:
					'Não foi possível criar um código, porque ele já existe.',
			});
	}

	async delete(input: IDeleteOTPInput): Promise<void> {
		const redis = await this.redisService.instance();
		await redis.del(`${RedisEnum.otp}${input.email.value}`);
	}

	async find(input: IFindOTPInput): Promise<OTP | undefined> {
		const redis = await this.redisService.instance();
		const rawRes = await redis.get(`${RedisEnum.otp}${input.email.value}`);
		const res = rawRes
			? OTPRedisMapper.toClass(JSON.parse(rawRes))
			: undefined;

		return res;
	}
}
