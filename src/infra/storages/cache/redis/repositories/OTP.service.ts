import {
	ICreateOTPInput,
	IDeleteOTPInput,
	IFindOTPInput,
	OTPRepo,
} from '@app/repositories/otp';
import { RedisService } from '../redis.service';
import { Injectable } from '@nestjs/common';
import { RedisEnum } from '../redisEnum';
import { RedisErrorsTags, RedisLogicError } from '../../errors/redis';
import { OTP } from '@app/entities/OTP';
import { OTPRedisMapper } from '../mapper/otp';

@Injectable()
export class OTPRedisService implements OTPRepo {
	constructor(private readonly redisService: RedisService) {}

	async create(input: ICreateOTPInput): Promise<void> {
		const otpObjt = OTPRedisMapper.toRedis(input.otp);

		const res = await this.redisService.instance.set(
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
		await this.redisService.instance.del(
			`${RedisEnum.otp}${input.email.value}`,
		);
	}

	async find(input: IFindOTPInput): Promise<OTP | undefined> {
		const rawRes = await this.redisService.instance.get(
			`${RedisEnum.otp}${input.email.value}`,
		);
		const res = rawRes
			? OTPRedisMapper.toClass(JSON.parse(rawRes))
			: undefined;

		return res;
	}
}
