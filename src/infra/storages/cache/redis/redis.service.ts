import {
	Injectable,
	OnApplicationShutdown,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import { RedisErrorsTags, RedisLogicError } from './error';

@Injectable()
export class RedisService
implements OnModuleInit, OnApplicationShutdown, OnModuleDestroy
{
	private _instance: Redis;

	private async waitForConnection() {
		if (this._instance.status === 'ready') return;

		if (
			this._instance.status === 'close' ||
			this._instance.status === 'end'
		)
			await this._instance.connect();

		return await new Promise((resolve, rejects) => {
			const eventId = setTimeout(async () => {
				await this.close();
				rejects(
					new RedisLogicError({
						message: 'Redis ultrapassou o tempo limite de conexão',
						tag: RedisErrorsTags.connectionTimeout,
					}),
				);
			}, 4500);

			this._instance.prependListener('ready', () => {
				clearTimeout(eventId);
				return resolve(undefined);
			});
		});
	}

	private async init() {
		if (!this._instance)
			this._instance = new Redis(process.env.REDIS_URL as string);

		await this.waitForConnection();
	}

	private async close() {
		if (
			this._instance &&
			(this._instance.status === 'connect' ||
				this._instance.status === 'connecting')
		)
			await this._instance.quit();
	}

	async onModuleInit() {
		await this.init();
	}

	async onApplicationShutdown() {
		await this.close();
	}

	async onModuleDestroy() {
		await this.close();
	}

	async instance(): Promise<Redis> {
		if (!this._instance) await this.init();

		return this._instance;
	}
}
