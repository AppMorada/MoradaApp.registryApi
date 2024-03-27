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
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmInviteRepo implements InviteRepo {
	constructor(
		@Inject(typeORMConsts.entity.invite)
		private readonly inviteRepo: Repository<TypeOrmInviteEntity>,
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async find(input: InviteRepoInterfaces.find): Promise<Invite[]>;
	async find(input: InviteRepoInterfaces.safelyFind): Promise<Invite[]>;

	async find(
		input: InviteRepoInterfaces.find | InviteRepoInterfaces.safelyFind,
	): Promise<Invite[]> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);

		const event = span.addEvent('search invite');
		const raw = await this.inviteRepo.find({
			where: { recipient: input.key.value },
			order: {
				createdAt: 'DESC',
			},
			loadRelationIds: true,
		});
		event.end();

		if (raw.length <= 0 && input?.safeSearch)
			throw new DatabaseCustomError({
				message: 'Este convite não existe',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});

		const invites = raw.map((item, index) => {
			const event = span.addEvent(`Parse result index ${index}`);
			const result = TypeOrmInviteMapper.toClass(item);
			event.end();

			return result;
		});
		return invites;
	}

	async transferToUserResources(
		input: InviteRepoInterfaces.transferToUserResources,
	): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);

		await this.dataSource.transaction(async (t) => {
			const deleteInviteEvent = span.addEvent('delete invite');
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
			deleteInviteEvent.end();

			const createIfNotExistUniqueRegistryEvent = span.addEvent(
				'create unique registry if not exists',
			);
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
			createIfNotExistUniqueRegistryEvent.end();

			const createUserEvent = span.addEvent('create user');

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

			createUserEvent.end();
		});

		span.end();
	}

	async delete(input: InviteRepoInterfaces.remove): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);

		const event = span.addEvent('delete invite');
		await this.dataSource
			.getRepository(TypeOrmInviteEntity)
			.createQueryBuilder('invite')
			.delete()
			.where('member_id = :id', { id: input.key.value })
			.execute();
		event.end();
	}
}
