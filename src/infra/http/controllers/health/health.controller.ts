import { Controller, Get } from '@nestjs/common';
import { HEALTH_PREFIX } from './consts';
import {
	HealthCheck,
	HealthCheckService,
	HttpHealthIndicator,
	MemoryHealthIndicator,
	PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '@infra/storages/db/prisma/prisma.service';
import { RedisHealthIndicator } from '@infra/storages/cache/redis/healthIndicator';
import { RedisService } from '@infra/storages/cache/redis/redis.service';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';

@Controller(HEALTH_PREFIX)
export class HealthController {
	constructor(
		private readonly health: HealthCheckService,
		private readonly mem: MemoryHealthIndicator,
		private readonly http: HttpHealthIndicator,
		private readonly prismaIndicator: PrismaHealthIndicator,
		private readonly prismaClient: PrismaService,
		private readonly redisIndicator: RedisHealthIndicator,
		private readonly redisClient: RedisService,
		private readonly getEnv: GetEnvService,
	) {}

	@Get()
	@HealthCheck()
	async check() {
		const { env: MAX_MEMORY_HEAP } = await this.getEnv.exec({
			env: EnvEnum.MAX_MEMORY_HEAP,
		});
		const { env: MAX_MEMORY_RSS } = await this.getEnv.exec({
			env: EnvEnum.MAX_MEMORY_RSS,
		});

		const repo = 'https://github.com/AppMorada/MoradaApp.Api';
		const max_mem_heap = parseInt(MAX_MEMORY_HEAP as string);
		const max_mem_rss = parseInt(MAX_MEMORY_RSS as string);

		return this.health.check([
			() => this.http.pingCheck('http', repo),
			() => this.mem.checkHeap('memory_heap', max_mem_heap),
			() => this.mem.checkRSS('memory_rss', max_mem_rss),
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
