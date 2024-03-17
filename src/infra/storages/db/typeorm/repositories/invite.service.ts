import { InviteRepo, InviteRepoInterfaces } from '@app/repositories/invite';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmInviteEntity } from '../entities/invite.entity';
import { DataSource, Repository } from 'typeorm';
import { Invite } from '@app/entities/invite';
import { TypeOrmInviteMapper } from '../mapper/invite';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';
import { TypeOrmUserMapper } from '../mapper/user';
import { typeORMConsts } from '../consts';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';
import { TypeOrmUniqueRegistryEntity } from '../entities/uniqueRegistry.entity';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { TypeOrmUniqueRegistryMapper } from '../mapper/uniqueRegistry';

@Injectable()
export class TypeOrmInviteRepo implements InviteRepo {
	constructor(
		@Inject(typeORMConsts.entity.invite)
		private readonly inviteRepo: Repository<TypeOrmInviteEntity>,
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
	) {}

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
				.createQueryBuilder('invite')
				.delete()
				.where('condominium_id = :condominium_id', {
					condominium_id: input.invite.condominiumId.value,
				})
				.andWhere('member_id = :member_id', {
					member_id: input.invite.memberId.value,
				})
				.execute();

			let uniqueRegistry = await t
				.getRepository(TypeOrmUniqueRegistryEntity)
				.findOne({
					where: {
						email: input.rawUniqueRegistry.email.value,
						CPF: input.rawUniqueRegistry.CPF.value,
					},
					lock: {
						mode: 'pessimistic_read',
					},
				});
			if (!uniqueRegistry) {
				uniqueRegistry = TypeOrmUniqueRegistryMapper.toTypeOrm(
					new UniqueRegistry({
						CPF: input.rawUniqueRegistry.CPF.value,
						email: input.rawUniqueRegistry.email.value,
					}),
				);
				await t.insert('unique_registries', uniqueRegistry);
			}

			const user = TypeOrmUserMapper.toTypeOrm(input.user);
			user.uniqueRegistry = uniqueRegistry.id;
			await t.insert('users', user);
			await t
				.getRepository(TypeOrmCondominiumMemberEntity)
				.createQueryBuilder('condominium_member')
				.update('condominium_members')
				.set({ user: user.id })
				.andWhere('id = :id', { id: input.invite.memberId.value })
				.execute();
		});
	}

	async delete(input: InviteRepoInterfaces.remove): Promise<void> {
		await this.dataSource
			.getRepository(TypeOrmInviteEntity)
			.createQueryBuilder('invite')
			.delete()
			.where('member_id = :id', { id: input.key.value })
			.execute();
	}
}
