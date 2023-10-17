import {
	Injectable,
	OnApplicationShutdown,
	OnModuleDestroy,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService
	extends Redis
	implements OnModuleDestroy, OnApplicationShutdown
{
	constructor() {
		super();
	}

	async onModuleDestroy() {
		await this.quit();
	}

	async onApplicationShutdown() {
		await this.quit();
	}
}
