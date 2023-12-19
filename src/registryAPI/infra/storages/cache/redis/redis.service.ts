import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
	private _instance: Redis;

	async init() {
		if (!this._instance)
			this._instance = new Redis(process.env.REDIS_URL as string);

		if (
			this._instance.status === 'close' ||
			this._instance.status === 'end'
		) {
			await this._instance.connect();
		}
	}

	async close() {
		if (
			this._instance &&
			(this._instance.status === 'connect' ||
				this._instance.status === 'connecting')
		)
			await this._instance.quit();
	}

	get instance(): Redis {
		return this._instance;
	}
}
