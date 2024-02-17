import { Secret } from '@app/entities/secret';
import { SecretRepo } from '@app/repositories/secret';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class NestjsCacheSecret implements SecretRepo {
	constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

	async add(input: Secret): Promise<void> {
		await this.cache.set(input.key, input.value, 0);
	}

	async get(key: string): Promise<Secret | undefined> {
		const secretValue = await this.cache.get<string>(key);
		if (!secretValue) return undefined;
		return new Secret({ key, value: secretValue });
	}

	async delete(key: string): Promise<void> {
		await this.cache.del(key);
	}
}
