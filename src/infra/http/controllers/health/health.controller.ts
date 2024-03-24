import { Controller, Get, Inject } from '@nestjs/common';
import { HEALTH_PREFIX } from './consts';
import {
	HealthCheck,
	HealthCheckService,
	HttpHealthIndicator,
	MemoryHealthIndicator,
	TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { EnvEnum, GetEnvService } from '@infra/configs/env/getEnv.service';
import { DataSource } from 'typeorm';
import { typeORMConsts } from '@infra/storages/db/typeorm/consts';

@Controller(HEALTH_PREFIX)
export class HealthController {
	constructor(
		private readonly health: HealthCheckService,
		private readonly mem: MemoryHealthIndicator,
		private readonly http: HttpHealthIndicator,
		private readonly typeOrmIndication: TypeOrmHealthIndicator,
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
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
				this.typeOrmIndication.pingCheck('typeorm_client', {
					connection: this.dataSource,
				}),
		]);
	}
}
