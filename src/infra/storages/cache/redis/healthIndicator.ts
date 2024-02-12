import { Injectable } from '@nestjs/common';
import {
	HealthCheckError,
	HealthIndicator,
	HealthIndicatorResult,
} from '@nestjs/terminus';
import { RedisService } from './redis.service';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
	async isHealthy(
		key: string,
		redis: RedisService,
	): Promise<HealthIndicatorResult> {
		const instance = await redis.instance();
		const isConnected = instance.status === 'ready';

		const result = this.getStatus(key, isConnected, {
			status: isConnected ? 'up' : instance.status,
		});
		if (isConnected) return result;

		throw new HealthCheckError('Redis failed', result);
	}
}
