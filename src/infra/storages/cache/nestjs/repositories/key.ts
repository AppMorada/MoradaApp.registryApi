import { Key } from '@app/entities/key';
import { KeyMapper } from '@app/mapper/key';
import { KeyCache, KeysEnum } from '@app/repositories/key';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class NestjsCacheKey implements KeyCache {
	constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

	async delete(name: KeysEnum): Promise<void> {
		await this.cache.del(`KEY[${name.toString()}]`);
	}

	async set(key: Key): Promise<void> {
		const parsedKey = JSON.stringify(KeyMapper.toObject(key));
		await this.cache.set(`KEY[${key.name.toString()}]`, parsedKey, 0);
	}

	async get(name: KeysEnum): Promise<Key | undefined> {
		const rawKey = await this.cache.get<string>(`KEY[${name.toString()}]`);

		if (!rawKey) return undefined;
		return JSON.parse(rawKey);
	}
}
