import {
	CondominiumRepo,
	ICreateCondominiumInput,
} from '@app/repositories/condominium';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { CondominiumPrismaMapper } from '../mapper/condominium';

@Injectable()
export class CondominiumPrismaRepo implements CondominiumRepo {
	constructor(private readonly prisma: PrismaService) {}

	async create(input: ICreateCondominiumInput): Promise<void> {
		const condominiumInPrisma = CondominiumPrismaMapper.toPrisma(
			input.condominium,
		);

		await this.prisma.condominium.create({
			data: { ...condominiumInPrisma },
		});
	}
}
