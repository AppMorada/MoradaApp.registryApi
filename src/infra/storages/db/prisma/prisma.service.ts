import {
	Injectable,
	OnApplicationShutdown,
	OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleDestroy, OnApplicationShutdown
{
	private status = false;

	async init() {
		if (!this.status)
			await this.$connect().then(() => (this.status = true));
	}

	async close() {
		if (this.status)
			await this.$disconnect().then(() => (this.status = false));
	}

	async onModuleDestroy() {
		if (this.status)
			await this.$disconnect().then(() => (this.status = false));
	}

	async onApplicationShutdown() {
		if (this.status)
			await this.$disconnect().then(() => (this.status = false));
	}
}
