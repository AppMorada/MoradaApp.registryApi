import {
	CondominiumRepo,
	ICondominiumSearchQuery,
	ICreateCondominiumInput,
} from '@app/repositories/condominium';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { CondominiumPrismaMapper } from '../mapper/condominium';
import { Condominium } from '@app/entities/condominium';
import { CondominiumMapper } from '@app/mapper/condominium';

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

	async find(
		input: ICondominiumSearchQuery,
	): Promise<Condominium | undefined> {
		const condominium = await this.prisma.condominium.findFirst({
			where: {
				OR: [
					{ name: input.name?.value },
					{ CEP: input.CEP?.value },
					{ CNPJ: input.CNPJ?.value },
					{ id: input.id },
				],
			},
		});

		return condominium ? CondominiumMapper.toClass(condominium) : undefined;
	}
}
