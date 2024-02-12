import { Injectable } from '@nestjs/common';
import { InviteRepo, InviteRepoInterfaces } from '@app/repositories/invite';
import { PrismaService } from '../prisma.service';
import { Invite } from '@app/entities/invite';
import { InvitePrismaMapper } from '../mapper/invite';
import { UserPrismaMapper } from '../mapper/user';
import { CondominiumRelUserPrismaMapper } from '../mapper/condominiumRelUser';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';

@Injectable()
export class InvitePrismaRepo implements InviteRepo {
	constructor(private readonly prisma: PrismaService) {}

	async create(input: InviteRepoInterfaces.create): Promise<void> {
		const data = InvitePrismaMapper.toPrisma(input.invite);
		await this.prisma.invite.create({ data });
	}

	async find(input: InviteRepoInterfaces.find): Promise<Invite | undefined>;
	async find(input: InviteRepoInterfaces.safelyFind): Promise<Invite>;

	async find(
		input: InviteRepoInterfaces.find | InviteRepoInterfaces.safelyFind,
	): Promise<Invite | undefined> {
		const unparsedInvite = await this.prisma.invite.findFirst({
			where: {
				email: input.key.value,
			},
		});

		if (!unparsedInvite && input?.safeSearch)
			throw new DatabaseCustomError({
				message: 'Este convite não existe',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});

		if (!unparsedInvite) return undefined;

		const invite = InvitePrismaMapper.toClass(unparsedInvite);
		return invite;
	}

	async transferToUserResources(
		input: InviteRepoInterfaces.transferToUserResources,
	): Promise<void> {
		const user = UserPrismaMapper.toPrisma(input.user);
		const condominiumRelUser = CondominiumRelUserPrismaMapper.toPrisma(
			input.condominiumRelUser,
		);

		const invite = await this.prisma.invite.findFirst({
			where: { email: user.email },
		});

		if (!invite)
			throw new DatabaseCustomError({
				message: 'Não foi possível criar um usuário',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});

		await this.prisma.$transaction([
			this.prisma.invite.delete({
				where: { id: invite.id },
			}),
			this.prisma.user.create({ data: user }),
			this.prisma.condominiumRelUser.create({ data: condominiumRelUser }),
		]);
	}

	async delete(input: InviteRepoInterfaces.remove): Promise<void> {
		await this.prisma.invite.delete({
			where: { id: input.key.value },
		});
	}
}
