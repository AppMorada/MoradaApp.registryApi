import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { UserRepoInterfaces, UserRepo } from '@app/repositories/user';
import { UserPrismaMapper } from '../mapper/user';
import { User } from '@app/entities/user';
import { Email, UUID } from '@app/entities/VO';
import { CondominiumRelUser } from '@app/entities/condominiumRelUser';
import { CondominiumRelUserPrismaMapper } from '../mapper/condominiumRelUser';
import {
	CondominiumRelUserMapper,
	TCondominiumRelUserToObject,
} from '@app/mapper/condominiumRelUser';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';

@Injectable()
export class UserPrismaRepo implements UserRepo {
	constructor(private readonly prisma: PrismaService) {}

	async create(): Promise<void> {}

	async find(input: UserRepoInterfaces.safeSearch): Promise<User>;
	async find(input: UserRepoInterfaces.search): Promise<User | undefined>;

	async find(
		input: UserRepoInterfaces.search | UserRepoInterfaces.safeSearch,
	): Promise<User | undefined> {
		const query =
			input.key instanceof UUID
				? { id: input.key.value }
				: input.key instanceof Email
					? { email: input.key.value }
					: { CPF: input.key.value };

		const unparsedUser = await this.prisma.user.findFirst({
			where: {
				OR: [query],
			},
		});

		if (!unparsedUser && input?.safeSearch)
			throw new DatabaseCustomError({
				message: 'Este usuário não existe',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});

		if (!unparsedUser) return undefined;

		const user = UserPrismaMapper.toClass(unparsedUser);
		return user;
	}

	async getCondominiumRelation(
		input: UserRepoInterfaces.getCondominiumRelation,
	): Promise<CondominiumRelUser | undefined> {
		const unparsedCondominiumRelUser =
			await this.prisma.condominiumRelUser.findFirst({
				where: {
					AND: [
						{ userId: input.userId.value },
						{ condominiumId: input.condominiumId.value },
					],
				},
			});

		if (!unparsedCondominiumRelUser) return undefined;

		const condominiumRelUser = CondominiumRelUserPrismaMapper.toClass(
			unparsedCondominiumRelUser,
		);
		return condominiumRelUser;
	}

	async getAllCondominiumRelation(
		input: UserRepoInterfaces.getAllCondominiumRelation,
	): Promise<TCondominiumRelUserToObject[]> {
		const unparsedCondominiumRelGroup =
			await this.prisma.condominiumRelUser.findMany({
				where: {
					userId: input.userId.value,
				},
			});

		const condominiumRelGroup = unparsedCondominiumRelGroup.map((item) => {
			return CondominiumRelUserMapper.toObject(
				CondominiumRelUserPrismaMapper.toClass(item),
			);
		});

		return condominiumRelGroup;
	}

	async delete(input: UserRepoInterfaces.remove): Promise<undefined> {
		const query = { id: input.key.value };

		if (input.key instanceof Email) {
			const user = await this.find({ key: input.key, safeSearch: true });
			query.id = user.id.value;
		}

		await this.prisma.user.delete({ where: query });
	}
}
