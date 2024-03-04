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
import { CondominiumMember } from '@app/entities/condominiumMember';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';
import { TypeOrmCondominiumMemberMapper } from '../mapper/condominiumMember';
import { Email } from '@app/entities/VO';

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
				.getRepository(TypeOrmCondominiumMemberEntity)
				.createQueryBuilder('condominium_members')
				.innerJoin('users', 'a', 'a.id = condominium_members.user_id')
				.where('condominium_members.condominium_id = :id', {
					id: input.invite.condominiumId.value,
				})
				.andWhere('a.cpf = :cpf', { cpf: input.invite.CPF.value })
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

	async find(input: InviteRepoInterfaces.find): Promise<Invite | undefined>;
	async find(input: InviteRepoInterfaces.safelyFind): Promise<Invite>;

	async find(
		input: InviteRepoInterfaces.find | InviteRepoInterfaces.safelyFind,
	): Promise<Invite | undefined> {
		const buildQuery = () => {
			if (input.key instanceof Email)
				return { recipient: input.key.value };
			return { CPF: input.key.value };
		};

		const rawInvite = await this.inviteRepo.findOne({
			where: buildQuery(),
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
		const invite = await this.inviteRepo.findOne({
			where: { CPF: user.CPF },
			loadRelationIds: true,
		});

		if (!invite)
			throw new DatabaseCustomError({
				message: 'Não foi possível criar um usuário',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});

		const rawCondominiumMember = new CondominiumMember({
			condominiumId: String(invite.condominium),
			hierarchy: invite.hierarchy,
			c_email: user.email,
			autoEdit: false,
			userId: user.id,
		});
		const condominiumMember =
			TypeOrmCondominiumMemberMapper.toTypeOrm(rawCondominiumMember);

		await this.dataSource.transaction(async (t) => {
			await t.remove(invite);
			await t.insert<TypeOrmUserEntity>('users', user);
			const existentCondominiumMember = await t
				.getRepository(TypeOrmCondominiumMemberEntity)
				.createQueryBuilder('condominium_member')
				.where('condominium_member.condominium_id = :condominium_id', {
					condominium_id: input.condominiumId.value,
				})
				.andWhere('condominium_member.c_email = :c_email', {
					c_email: invite.recipient,
				})
				.loadAllRelationIds()
				.getCount();

			if (!existentCondominiumMember)
				await t.insert<TypeOrmCondominiumMemberEntity>(
					'condominium_members',
					condominiumMember,
				);
		});
	}

	async delete(input: InviteRepoInterfaces.remove): Promise<void> {
		await this.inviteRepo.delete({ id: input.key.value });
	}
}
