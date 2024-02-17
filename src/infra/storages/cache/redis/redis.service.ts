import {
	Injectable,
	OnApplicationShutdown,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import { RedisErrorsTags, RedisLogicError } from './error';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';

@Injectable()
export class RedisService
implements OnModuleInit, OnApplicationShutdown, OnModuleDestroy
{
	private _instance: Redis;

	constructor(private readonly getEnv: GetEnvService) {}

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
		const { env: REDIS_URL } = await this.getEnv.exec({
			env: EnvEnum.REDIS_URL,
		});
		if (!this._instance) this._instance = new Redis(REDIS_URL as string);

		await this.waitForConnection();
	}

	private async close() {
		const isInConnectingState =
			this._instance.status === 'connect' ||
			this._instance.status === 'connecting';
		if (this._instance && isInConnectingState) await this._instance.quit();
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
