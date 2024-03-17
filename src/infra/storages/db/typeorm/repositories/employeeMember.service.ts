import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../consts';
import { DataSource } from 'typeorm';
import {
	EmployeeMemberRepo,
	EmployeeMemberRepoInterfaces,
} from '@app/repositories/employeeMember';
import { TypeOrmUserMapper } from '../mapper/user';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { TypeOrmCondominiumMemberMapper } from '../mapper/condominiumMember';
import { TypeOrmUniqueRegistryEntity } from '../entities/uniqueRegistry.entity';
import { TypeOrmUniqueRegistryMapper } from '../mapper/uniqueRegistry';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';
import { IUserInObject } from '@app/mapper/user';
import { IUniqueRegistryInObject } from '@app/mapper/uniqueRegistry';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';

@Injectable()
export class TypeOrmEmployeeMemberRepo implements EmployeeMemberRepo {
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
	) {}

	async create(input: EmployeeMemberRepoInterfaces.create): Promise<void> {
		await this.dataSource.transaction(async (t) => {
			const uniqueRegistry = new UniqueRegistry({
				email: input.rawUniqueRegistry.email.value,
				CPF: input.rawUniqueRegistry.CPF.value,
			});
			const member = TypeOrmCondominiumMemberMapper.toTypeOrm(
				input.member,
			);
			const user = TypeOrmUserMapper.toTypeOrm(input.user);
			user.uniqueRegistry = uniqueRegistry.id.value;
			member.uniqueRegistry = uniqueRegistry.id.value;

			await t.insert(
				'unique_registries',
				TypeOrmUniqueRegistryMapper.toTypeOrm(uniqueRegistry),
			);
			await t.insert('users', user);
			await t.insert('condominium_members', member);
		});
	}

	async getByUserId(
		input: EmployeeMemberRepoInterfaces.getByUserId,
	): Promise<EmployeeMemberRepoInterfaces.getByUserIdReturn | undefined> {
		const raw = await this.dataSource
			.getRepository(TypeOrmCondominiumMemberEntity)
			.createQueryBuilder('condominium_member')
			.innerJoinAndSelect(
				'condominium_member.user',
				'a',
				'a.id = condominium_member.user_id',
			)
			.innerJoinAndSelect('condominium_member.uniqueRegistry', 'b')
			.where('condominium_member.user_id = :id', {
				id: input.id.value,
			})
			.andWhere('condominium_member.role = 1')
			.loadAllRelationIds({
				relations: ['condominium'],
			})
			.getMany();

		if (!raw) return undefined;

		let user: IUserInObject | undefined;
		let uniqueRegistry: IUniqueRegistryInObject | undefined;

		const worksOn = raw.map((item) => {
			const typeOrmUser = item.user as TypeOrmUserEntity;
			const typeOrmUniqueRegistry =
				item.uniqueRegistry as TypeOrmUniqueRegistryEntity;

			if (!user) {
				user = TypeOrmUserMapper.toObject(typeOrmUser);
				user.uniqueRegistryId = typeOrmUniqueRegistry.id;
			}
			if (!uniqueRegistry)
				uniqueRegistry = TypeOrmUniqueRegistryMapper.toObject(
					typeOrmUniqueRegistry,
				);

			item.user = typeOrmUser.id;
			item.uniqueRegistry = typeOrmUniqueRegistry.id;
			return TypeOrmCondominiumMemberMapper.toObject(item);
		});

		return worksOn.length > 0
			? {
				worksOn,
				user: user!,
				uniqueRegistry: uniqueRegistry!,
			}
			: undefined;
	}

	async getGroupCondominiumId(
		input: EmployeeMemberRepoInterfaces.getByCondominiumId,
	): Promise<EmployeeMemberRepoInterfaces.getByCondominiumIdReturn[]> {
		const raw = await this.dataSource
			.getRepository(TypeOrmCondominiumMemberEntity)
			.createQueryBuilder('condominium_member')
			.innerJoinAndSelect(
				'condominium_member.user',
				'a',
				'a.id = condominium_member.user_id',
			)
			.innerJoinAndSelect('condominium_member.uniqueRegistry', 'b')
			.where('condominium_member.condominium_id = :condominiumId', {
				condominiumId: input.condominiumId.value,
			})
			.andWhere('condominium_member.role = 1')
			.loadAllRelationIds({
				relations: ['condominium'],
			})
			.getMany();

		return raw.map((item) => {
			const typeOrmUser = item.user as TypeOrmUserEntity;
			const typeOrmUniqueRegistry =
				item.uniqueRegistry as TypeOrmUniqueRegistryEntity;

			const uniqueRegistry = TypeOrmUniqueRegistryMapper.toObject(
				typeOrmUniqueRegistry,
			);
			const condominiumMemberInfos =
				TypeOrmCondominiumMemberMapper.toObject(item);
			condominiumMemberInfos.uniqueRegistryId = uniqueRegistry.id;
			condominiumMemberInfos.userId = typeOrmUser.id;

			const userAsObjt = TypeOrmUserMapper.toObject(typeOrmUser) as any;
			userAsObjt.uniqueRegistryId = uniqueRegistry.id;
			delete userAsObjt.password;
			delete userAsObjt.tfa;

			return { user: userAsObjt, uniqueRegistry, condominiumMemberInfos };
		});
	}

	async update(input: EmployeeMemberRepoInterfaces.update): Promise<void> {
		const modifications = {
			name: input.name?.value,
			phoneNumber: input.phoneNumber?.value,
		};

		for (const rawKey in modifications) {
			const key = rawKey as keyof typeof modifications;
			if (!modifications[key]) delete modifications[key];
		}

		if (modifications.name || modifications.phoneNumber)
			await this.dataSource
				.getRepository(TypeOrmUserEntity)
				.createQueryBuilder()
				.innerJoin(
					'condominium_members',
					'a',
					'a.condominium_id = :condominiumId',
					{ condominiumId: input.condominiumId.value },
				)
				.update('users')
				.set(modifications)
				.where('id = :userId', { userId: input.userId.value })
				.execute();
	}

	async remove(input: EmployeeMemberRepoInterfaces.remove): Promise<void> {
		await this.dataSource.transaction(async (t) => {
			const user = await t.getRepository(TypeOrmUserEntity).findOne({
				where: { id: input.userId.value },
				loadRelationIds: true,
			});

			if (!user)
				throw new DatabaseCustomError({
					message: 'Usuário não existe',
					tag: DatabaseCustomErrorsTags.contentDoesntExists,
				});

			await t
				.createQueryBuilder()
				.delete()
				.from('unique_registries')
				.where('id = :id', { id: user.uniqueRegistry })
				.execute();
		});
	}
}
