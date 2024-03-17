import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../consts';
import { DataSource } from 'typeorm';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';
import { TypeOrmCondominiumMemberMapper } from '../mapper/condominiumMember';
import {
	CommunityMemberRepo,
	CommunityMemberRepoInterfaces,
} from '@app/repositories/communityMember';
import { TypeOrmCommunityInfoMapper } from '../mapper/communityInfo';
import { TypeOrmUniqueRegistryEntity } from '../entities/uniqueRegistry.entity';
import { TypeOrmUniqueRegistryMapper } from '../mapper/uniqueRegistry';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { TypeOrmCommunityInfosEntity } from '../entities/communityInfos.entity';
import { TypeOrmCondominiumEntity } from '../entities/condominium.entity';
import { TypeOrmInviteMapper } from '../mapper/invite';

@Injectable()
export class TypeOrmCommunityMemberRepo implements CommunityMemberRepo {
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
	) {}

	async create(input: CommunityMemberRepoInterfaces.create): Promise<void> {
		await this.dataSource.transaction(async (t) => {
			const uniqueRegistryExists = await t
				.getRepository(TypeOrmUniqueRegistryEntity)
				.exist({
					where: { email: input.rawUniqueRegistry.email.value },
				});

			if (!uniqueRegistryExists) {
				const uniqueRegistry = new UniqueRegistry({
					email: input.rawUniqueRegistry.email.value,
					CPF: input.rawUniqueRegistry.CPF.value,
				});
				await t.insert(
					'unique_registries',
					TypeOrmUniqueRegistryMapper.toTypeOrm(uniqueRegistry),
				);
			}

			const member = TypeOrmCondominiumMemberMapper.toTypeOrm(
				input.member,
			);
			const communityInfo = TypeOrmCommunityInfoMapper.toTypeOrm(
				input.communityInfos,
			);
			const invite = TypeOrmInviteMapper.toTypeOrm(input.invite);
			await t.insert('condominium_members', member);
			await t.insert('community_infos', communityInfo);
			await t.insert('invites', invite);
		});
	}

	async createMany(
		input: CommunityMemberRepoInterfaces.createMany,
	): Promise<void> {
		await this.dataSource.transaction(async (t) => {
			for (let i = 0; i < input.members.length; i++) {
				const rawUniqueRegistry = input.members[i].rawUniqueRegistry;
				let typeOrmUniqueRegistry = await t
					.getRepository(TypeOrmUniqueRegistryEntity)
					.findOne({
						where: {
							email: rawUniqueRegistry.email.value,
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
	}

	async checkByUserAndCondominiumId(
		input: CommunityMemberRepoInterfaces.getByUserIdAndCondominiumId,
	): Promise<number> {
		const count = await this.dataSource
			.getRepository(TypeOrmCondominiumMemberEntity)
			.createQueryBuilder('condominium_member')
			.innerJoinAndSelect(
				'condominium_member.communityInfos',
				'a',
				'a.member_id = condominium_member.id',
			)
			.where('condominium_member.user_id = :user_id', {
				user_id: input.userId.value,
			})
			.andWhere('condominium_member.condominium_id = :condominium_id', {
				condominium_id: input.condominiumId.value,
			})
			.andWhere('condominium_member.role = 0')
			.getCount();

		return count;
	}

	async getByUserId(
		input: CommunityMemberRepoInterfaces.getByUserId,
	): Promise<CommunityMemberRepoInterfaces.getByUserIdReturn[]> {
		const raw = await this.dataSource
			.getRepository(TypeOrmCondominiumMemberEntity)
			.createQueryBuilder('condominium_member')
			.innerJoinAndSelect(
				'condominium_member.communityInfos',
				'a',
				'a.member_id = condominium_member.id',
			)
			.where('condominium_member.user_id = :user_id', {
				user_id: input.id.value,
			})
			.andWhere('condominium_member.role = 0')
			.loadAllRelationIds({
				relations: ['condominium', 'user', 'uniqueRegistry'],
			})
			.getMany();

		return raw.map((item) => {
			const member = TypeOrmCondominiumMemberMapper.toObject(item);
			const communityInfos = TypeOrmCommunityInfoMapper.toObject(
				item.communityInfos,
			);
			return { member, communityInfos };
		});
	}

	async getById(
		input: CommunityMemberRepoInterfaces.getById,
	): Promise<CommunityMemberRepoInterfaces.getByIdReturn | undefined> {
		const raw = await this.dataSource
			.getRepository(TypeOrmCondominiumMemberEntity)
			.createQueryBuilder('condominium_member')
			.innerJoinAndSelect(
				'condominium_member.communityInfos',
				'a',
				'a.member_id = condominium_member.id',
			)
			.innerJoinAndSelect('condominium_member.uniqueRegistry', 'b')
			.where('condominium_member.id = :id', { id: input.id.value })
			.andWhere('condominium_member.role = 0')
			.loadAllRelationIds({
				relations: ['condominium', 'user'],
			})
			.getOne();

		if (!raw) return undefined;

		const uniqueRegistry = TypeOrmUniqueRegistryMapper.toClass(
			raw.uniqueRegistry as TypeOrmUniqueRegistryEntity,
		);
		raw.uniqueRegistry = uniqueRegistry.id.value;

		const member = TypeOrmCondominiumMemberMapper.toClass(raw);
		const communityInfos = TypeOrmCommunityInfoMapper.toClass(
			raw.communityInfos,
		);

		return { member, communityInfos, uniqueRegistry };
	}

	async getGroupCondominiumId(
		input: CommunityMemberRepoInterfaces.getByCondominiumId,
	): Promise<CommunityMemberRepoInterfaces.getByCondominiumIdReturn[]> {
		const raw = await this.dataSource
			.getRepository(TypeOrmCondominiumMemberEntity)
			.createQueryBuilder('condominium_member')
			.innerJoinAndSelect(
				'condominium_member.communityInfos',
				'a',
				'a.member_id = condominium_member.id',
			)
			.innerJoinAndSelect('condominium_member.uniqueRegistry', 'b')
			.where('condominium_member.condominium_id = :condominium_id', {
				condominium_id: input.condominiumId.value,
			})
			.andWhere('condominium_member.role = 0')
			.loadAllRelationIds({
				relations: ['condominium', 'user'],
			})
			.getMany();

		return raw.map((item) => {
			const uniqueRegistry = TypeOrmUniqueRegistryMapper.toObject(
				item.uniqueRegistry as TypeOrmUniqueRegistryEntity,
			);
			item.uniqueRegistry = uniqueRegistry.id;

			const member = TypeOrmCondominiumMemberMapper.toObject(item);
			const communityInfos = TypeOrmCommunityInfoMapper.toObject(
				item.communityInfos,
			);

			return { member, communityInfos, uniqueRegistry };
		});
	}

	async update(input: CommunityMemberRepoInterfaces.update): Promise<void> {
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
	}

	async remove(input: CommunityMemberRepoInterfaces.remove): Promise<void> {
		await this.dataSource.transaction(async (t) => {
			const member = await t
				.getRepository(TypeOrmCondominiumMemberEntity)
				.findOne({
					where: {
						id: input.id.value,
					},
					loadRelationIds: true,
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
	}
}
