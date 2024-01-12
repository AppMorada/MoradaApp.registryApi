import {
	CondominiumRepo,
	CondominiumInterfaces,
} from '@registry:app/repositories/condominium';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { CondominiumPrismaMapper } from '../mapper/condominium';
import { Condominium } from '@registry:app/entities/condominium';
import { CEP, CNPJ, Name } from '@registry:app/entities/VO';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';

@Injectable()
export class CondominiumPrismaRepo implements CondominiumRepo {
	constructor(private readonly prisma: PrismaService) {}

	async create(input: CondominiumInterfaces.create): Promise<void> {
		const condominiumInPrisma = CondominiumPrismaMapper.toPrisma(
			input.condominium,
		);

		await this.prisma.condominium.create({
			data: { ...condominiumInPrisma },
		});
	}

	async find(input: CondominiumInterfaces.safeSearch): Promise<Condominium>;
	async find(
		input: CondominiumInterfaces.search,
	): Promise<Condominium | undefined>;

	async find(
		input: CondominiumInterfaces.search | CondominiumInterfaces.safeSearch,
	): Promise<Condominium | undefined> {
		const query =
			input.key instanceof Name
				? { name: input.key.value }
				: input.key instanceof CEP
					? { CEP: input.key.value }
					: input.key instanceof CNPJ
						? { CNPJ: input.key.value }
						: { id: input.key.value };

		const unparsedCondominium = await this.prisma.condominium.findFirst({
			where: query,
		});

		if (!unparsedCondominium && input?.safeSearch)
			throw new DatabaseCustomError({
				message: 'Este usuário não existe',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});

		if (!unparsedCondominium) return undefined;

		const condominium =
			CondominiumPrismaMapper.toClass(unparsedCondominium);
		return condominium;
	}
}
