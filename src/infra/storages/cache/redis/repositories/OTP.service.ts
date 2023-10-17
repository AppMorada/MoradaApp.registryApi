import {
	ICreateOTPInput,
	IDeleteOTPInput,
	IFindOTPInput,
	OTPRepo,
} from '@app/repositories/otp';
import { RedisService } from '../redis.service';
import { Injectable } from '@nestjs/common';
import { RedisEnum } from '../redisEnum';
import { OTPMapper } from '@app/mapper/otp';
import { RedisErrorsTags, RedisLogicError } from '../../errors/redis';
import { OTP } from '@app/entities/OTP';

@Injectable()
export class OTPRedisService implements OTPRepo {
	constructor(private readonly redisService: RedisService) {}

	async create(input: ICreateOTPInput): Promise<void> {
		const otpObjt = OTPMapper.toObject(input.otp);

		const res = await this.redisService.set(
			`${RedisEnum.otp}${input.otp.userId}`,
			JSON.stringify(otpObjt),
			'PX',
			input.otp.ttl ?? 1000 * 60 * 2,
			'NX',
		);

		if (!res)
			throw new RedisLogicError({
				tag: RedisErrorsTags.alreadyExist,
				message: 'Could not create OTP, because it already exist.',
			});
	}

	async delete(input: IDeleteOTPInput): Promise<void> {
		await this.redisService.del(`${RedisEnum.otp}${input.userId}`);
	}

	async find(input: IFindOTPInput): Promise<OTP | undefined> {
		const rawRes = await this.redisService.get(
			`${RedisEnum.otp}${input.userId}`,
		);
		const res = rawRes ? OTPMapper.toClass(JSON.parse(rawRes)) : undefined;

		return res;
	}
}
