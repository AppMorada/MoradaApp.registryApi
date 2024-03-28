import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../../consts';
import { DataSource } from 'typeorm';
import { TypeOrmCondominiumMemberEntity } from '../../entities/condominiumMember.entity';
import { TypeOrmCondominiumMemberMapper } from '../../mapper/condominiumMember';
import {
	CommunityMemberWriteOpsRepo,
	CommunityMemberRepoWriteOpsInterfaces,
} from '@app/repositories/communityMember/write';
import { TypeOrmCommunityInfoMapper } from '../../mapper/communityInfo';
import { TypeOrmUniqueRegistryEntity } from '../../entities/uniqueRegistry.entity';
import { TypeOrmUniqueRegistryMapper } from '../../mapper/uniqueRegistry';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { TypeOrmUserEntity } from '../../entities/user.entity';
import { TypeOrmCommunityInfosEntity } from '../../entities/communityInfos.entity';
import { TypeOrmCondominiumEntity } from '../../entities/condominium.entity';
import { TypeOrmInviteMapper } from '../../mapper/invite';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmCommunityMemberRepoWriteOps
implements CommunityMemberWriteOpsRepo
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async acceptRequest(): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute(
			'op.description',
			'Accept condominium request and create new condominium member',
		);

		// EXECUTAR TRANSACTION AQUI

		span.end();
	}

	async createMany(
		input: CommunityMemberRepoWriteOpsInterfaces.createMany,
	): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Create new community member');

		await this.dataSource.transaction(async (t) => {
			for (let i = 0; i < input.members.length; i++) {
				span.setAttribute('Member ID', i);

				const rawUniqueRegistry = input.members[i].rawUniqueRegistry;
				let typeOrmUniqueRegistry = await t
					.getRepository(TypeOrmUniqueRegistryEntity)
					.findOne({
						where: {
							email: rawUniqueRegistry.email.value,
						},
						lock: {
							mode: 'pessimistic_read',
						},
					});

				if (!typeOrmUniqueRegistry) {
					const uniqueRegistry = new UniqueRegistry({
						email: rawUniqueRegistry.email.value,
						CPF: rawUniqueRegistry.CPF.value,
					});
					typeOrmUniqueRegistry =
						TypeOrmUniqueRegistryMapper.toTypeOrm(uniqueRegistry);

					await t.insert('unique_registries', typeOrmUniqueRegistry);
				}

				const member = TypeOrmCondominiumMemberMapper.toTypeOrm(
					input.members[i].content,
				);
				member.uniqueRegistry = typeOrmUniqueRegistry.id;

				const communityInfo = TypeOrmCommunityInfoMapper.toTypeOrm(
					input.members[i].communityInfos,
				);
				const invite = TypeOrmInviteMapper.toTypeOrm(
					input.members[i].invite,
				);

				await t.insert('condominium_members', member);
				await t.insert('community_infos', communityInfo);
				await t.insert('invites', invite);
			}
		});

		span.end();
	}

	async update(
		input: CommunityMemberRepoWriteOpsInterfaces.update,
	): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Update community member');

		const modifications = {
			block: input.block?.value,
			apartmentNumber: input.apartmentNumber?.value,
		};

		for (const rawKey in modifications) {
			const key = rawKey as keyof typeof modifications;
			if (!modifications[key]) delete modifications[key];
		}

		if (modifications.block || modifications.apartmentNumber)
			await this.dataSource
				.getRepository(TypeOrmCommunityInfosEntity)
				.createQueryBuilder()
				.update('community_infos')
				.set({ ...modifications })
				.where('member_id = :id', { id: input.id.value })
				.execute();

		span.end();
	}

	async remove(
		input: CommunityMemberRepoWriteOpsInterfaces.remove,
	): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Remove community member');

		await this.dataSource.transaction(async (t) => {
			const member = await t
				.getRepository(TypeOrmCondominiumMemberEntity)
				.findOne({
					where: {
						id: input.id.value,
					},
					loadRelationIds: true,
					lock: {
						mode: 'pessimistic_read',
					},
				});
			if (!member) return;

			const userExists = await t.getRepository(TypeOrmUserEntity).exist({
				where: {
					uniqueRegistry: {
						id: member.uniqueRegistry as string,
					},
				},
			});
			if (!userExists)
				await t
					.getRepository(TypeOrmUniqueRegistryEntity)
					.createQueryBuilder()
					.delete()
					.from('unique_registries')
					.where('id = :id', { id: member.uniqueRegistry as string })
					.execute();

			await t
				.getRepository(TypeOrmCondominiumEntity)
				.createQueryBuilder()
				.delete()
				.from('condominium_members')
				.where('id = :id', { id: member.id })
				.execute();
		});

		span.end();
	}
}
