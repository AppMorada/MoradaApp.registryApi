import { InviteRepo, InviteRepoInterfaces } from '@app/repositories/invite';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmInviteEntity } from '../entities/invite.entity';
import { DataSource, Repository } from 'typeorm';
import { Invite } from '@app/entities/invite';
import { TypeOrmInviteMapper } from '../mapper/invite';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';
import { TypeOrmUserMapper } from '../mapper/user';
import { TypeOrmCondominiumRelUserMapper } from '../mapper/condominiumRelUser';
import { typeORMConsts } from '../consts';
import { TypeOrmCondominiumRelUserEntity } from '../entities/condominiumRelUser.entity';
import { TypeOrmUserEntity } from '../entities/user.entity';

@Injectable()
export class TypeOrmInviteRepo implements InviteRepo {
	constructor(
		@Inject(typeORMConsts.entity.invite)
		private readonly inviteRepo: Repository<TypeOrmInviteEntity>,
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
	) {}

	async create(input: InviteRepoInterfaces.create): Promise<void> {
		const data = TypeOrmInviteMapper.toTypeOrm(input.invite);

		await this.dataSource.transaction(async (t) => {
			const condominiumRelUser = await t
				.createQueryBuilder()
				.from(TypeOrmUserEntity, 'a')
				.innerJoin(
					TypeOrmCondominiumRelUserEntity,
					'b',
					'b.user_id = a.id AND b.condominium_id = :condominium_id',
					{ condominium_id: input.invite.condominiumId.value },
				)
				.where('a.email = :email', { email: input.invite.email.value })
				.getCount();

			if (condominiumRelUser)
				throw new DatabaseCustomError({
					message: 'Usuário já está neste condomínio',
					tag: DatabaseCustomErrorsTags.alreadyRegisteredCondominiumRelUser,
				});

			await t.insert<TypeOrmInviteEntity>('invites', data);
		});
	}

	async find(input: InviteRepoInterfaces.find): Promise<Invite | undefined>;
	async find(input: InviteRepoInterfaces.safelyFind): Promise<Invite>;

	async find(
		input: InviteRepoInterfaces.find | InviteRepoInterfaces.safelyFind,
	): Promise<Invite | undefined> {
		const rawInvite = await this.inviteRepo.findOne({
			where: { email: input.key.value },
			loadRelationIds: true,
		});

		if (!rawInvite && input?.safeSearch)
			throw new DatabaseCustomError({
				message: 'Este convite não existe',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});

		if (!rawInvite) return undefined;

		const invite = TypeOrmInviteMapper.toClass(rawInvite);
		return invite;
	}

	async transferToUserResources(
		input: InviteRepoInterfaces.transferToUserResources,
	): Promise<void> {
		const user = TypeOrmUserMapper.toTypeOrm(input.user);
		const condominiumRelUser = TypeOrmCondominiumRelUserMapper.toTypeOrm(
			input.condominiumRelUser,
		);

		const invite = await this.inviteRepo.findOne({
			where: { email: user.email },
		});

		if (!invite)
			throw new DatabaseCustomError({
				message: 'Não foi possível criar um usuário',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});

		await this.dataSource.transaction(async (t) => {
			await t.remove(invite);
			await t.insert<TypeOrmUserEntity>('users', user);
			await t.insert<TypeOrmCondominiumRelUserEntity>(
				'condominiumreluser',
				condominiumRelUser,
			);
		});
	}

	async delete(input: InviteRepoInterfaces.remove): Promise<void> {
		await this.inviteRepo.delete({ id: input.key.value });
	}
}
