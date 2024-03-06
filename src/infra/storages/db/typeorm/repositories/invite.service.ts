import { InviteRepo, InviteRepoInterfaces } from '@app/repositories/invite';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmInviteEntity } from '../entities/invite.entity';
import { DataSource, Repository } from 'typeorm';
import { Invite } from '@app/entities/invite';
import { TypeOrmInviteMapper } from '../mapper/invite';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';
import { TypeOrmUserMapper } from '../mapper/user';
import { typeORMConsts } from '../consts';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';

@Injectable()
export class TypeOrmInviteRepo implements InviteRepo {
	constructor(
		@Inject(typeORMConsts.entity.invite)
		private readonly inviteRepo: Repository<TypeOrmInviteEntity>,
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
	) {}

	async create(input: InviteRepoInterfaces.create): Promise<void> {
		await this.dataSource.transaction(async (t) => {
			const data = TypeOrmInviteMapper.toTypeOrm(input.invite);
			const user = await t
				.getRepository(TypeOrmUserEntity)
				.createQueryBuilder('users')
				.innerJoin('condominium_members', 'a', 'a.user_id = users.id')
				.where('email = :email', {
					email: input.invite.recipient.value,
				})
				.setLock('pessimistic_read')
				.getOne();

			if (user)
				throw new DatabaseCustomError({
					message: 'Content already exist',
					tag: DatabaseCustomErrorsTags.contentAlreadyExists,
				});

			await t.insert(TypeOrmInviteEntity, data);
		});
	}

	async find(input: InviteRepoInterfaces.find): Promise<Invite[]>;
	async find(input: InviteRepoInterfaces.safelyFind): Promise<Invite[]>;

	async find(
		input: InviteRepoInterfaces.find | InviteRepoInterfaces.safelyFind,
	): Promise<Invite[]> {
		const raw = await this.inviteRepo.find({
			where: { recipient: input.key.value },
			order: {
				createdAt: 'DESC',
			},
			loadRelationIds: true,
		});

		if (raw.length <= 0 && input?.safeSearch)
			throw new DatabaseCustomError({
				message: 'Este convite não existe',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});

		const invites = raw.map((item) => TypeOrmInviteMapper.toClass(item));
		return invites;
	}

	async transferToUserResources(
		input: InviteRepoInterfaces.transferToUserResources,
	): Promise<void> {
		await this.dataSource.transaction(async (t) => {
			await t
				.getRepository(TypeOrmInviteEntity)
				.createQueryBuilder('invites')
				.delete()
				.where('condominium_id = :condominium_id', {
					condominium_id: input.invite.condominiumId.value,
				})
				.andWhere('member_id = :member_id', {
					member_id: input.invite.memberId.value,
				})
				.execute();

			const user = TypeOrmUserMapper.toTypeOrm(input.user);
			await t.insert<TypeOrmUserEntity>('users', user);

			await t
				.getRepository(TypeOrmCondominiumMemberEntity)
				.createQueryBuilder()
				.update('condominium_members')
				.set({ user: user.id })
				.andWhere('id = :id', { id: input.invite.memberId.value })
				.execute();
		});
	}

	async delete(input: InviteRepoInterfaces.remove): Promise<void> {
		await this.inviteRepo.delete({ id: input.key.value });
	}
}
