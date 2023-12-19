import {
	CondominiumRepo,
	ICondominiumSearchQuery,
	ICreateCondominiumInput,
} from '@registry:app/repositories/condominium';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { CondominiumPrismaMapper } from '../mapper/condominium';
import { Condominium } from '@registry:app/entities/condominium';

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

		return condominium
			? CondominiumPrismaMapper.toClass(condominium)
			: undefined;
	}
}
