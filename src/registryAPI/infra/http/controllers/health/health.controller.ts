import { Controller, Get } from '@nestjs/common';
import { HEALTH_PREFIX } from './consts';
import {
	DiskHealthIndicator,
	HealthCheck,
	HealthCheckService,
	HttpHealthIndicator,
	MemoryHealthIndicator,
	PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '@registry:infra/storages/db/prisma/prisma.service';
import { RedisHealthIndicator } from '@registry:infra/storages/cache/redis/healthIndicator';
import { RedisService } from '@registry:infra/storages/cache/redis/redis.service';

@Controller(HEALTH_PREFIX)
export class HealthController {
	constructor(
		private readonly health: HealthCheckService,
		private readonly disk: DiskHealthIndicator,
		private readonly mem: MemoryHealthIndicator,
		private readonly http: HttpHealthIndicator,
		private readonly prismaIndicator: PrismaHealthIndicator,
		private readonly prismaClient: PrismaService,
		private readonly redisIndicator: RedisHealthIndicator,
		private readonly redisClient: RedisService,
	) {}

	@Get()
	@HealthCheck()
	check() {
		const repo = 'https://github.com/AppMorada/MoradaApp.Api';

		return this.health.check([
			() => this.http.pingCheck('http', repo),
			() =>
				this.disk.checkStorage('disk_storage', {
					path: '/',
					thresholdPercent: 0.8,
				}),
			() => this.mem.checkHeap('memory_heap', 150 * 1024 * 1024),
			() => this.mem.checkHeap('memory_rss', 270 * 1024 * 1024),
			() =>
				this.prismaIndicator.pingCheck(
					'prisma_client',
					this.prismaClient,
				),
			() =>
				this.redisIndicator.isHealthy('redis_client', this.redisClient),
		]);
	}
}
