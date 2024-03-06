import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../consts';
import { DataSource } from 'typeorm';
import { TypeOrmEnterpriseMemberEntity } from '../entities/enterpriseMember.entity';
import { EnterpriseMember } from '@app/entities/enterpriseMember';
import {
	EnterpriseMemberRepo,
	EnterpriseMemberRepoInterfaces,
} from '@app/repositories/enterpriseMember';
import { TypeOrmEnterpriseMemberMapper } from '../mapper/enterpriseMember';
import { TypeOrmUserMapper } from '../mapper/user';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { IUserInObject } from '@app/mapper/user';

@Injectable()
export class TypeOrmEnterpriseMemberRepo implements EnterpriseMemberRepo {
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
	) {}

	async create(input: EnterpriseMemberRepoInterfaces.create): Promise<void> {
		const member = TypeOrmEnterpriseMemberMapper.toTypeOrm(input.member);
		const user = TypeOrmUserMapper.toTypeOrm(input.user);
		await this.dataSource.transaction(async (t) => {
			await t.insert(TypeOrmUserEntity, { ...user });
			await t.insert(TypeOrmEnterpriseMemberEntity, { ...member });
		});
	}

	async getById(
		input: EnterpriseMemberRepoInterfaces.getByUserId,
	): Promise<EnterpriseMember | undefined> {
		const raw = await this.dataSource
			.getRepository(TypeOrmEnterpriseMemberEntity)
			.createQueryBuilder('enterprise_member')
			.where('enterprise_member.id = :id', { id: input.id.value })
			.loadAllRelationIds()
			.getOne();

		return raw ? TypeOrmEnterpriseMemberMapper.toClass(raw) : undefined;
	}

	async getByUserId(
		input: EnterpriseMemberRepoInterfaces.getByUserId,
	): Promise<EnterpriseMember | undefined> {
		const raw = await this.dataSource
			.getRepository(TypeOrmEnterpriseMemberEntity)
			.createQueryBuilder('enterprise_member')
			.where('enterprise_member.user_id = :user_id', {
				user_id: input.id.value,
			})
			.loadAllRelationIds()
			.getOne();

		return raw ? TypeOrmEnterpriseMemberMapper.toClass(raw) : undefined;
	}

	async getGroupCondominiumId(
		input: EnterpriseMemberRepoInterfaces.getByCondominiumId,
	): Promise<IUserInObject[]> {
		const raw = await this.dataSource
			.getRepository(TypeOrmUserEntity)
			.createQueryBuilder('users')
			.innerJoin('enterprise_members', 'a', 'a.user_id = users.id')
			.where('a.condominium_id = :condominium_id', {
				condominium_id: input.condominiumId.value,
			})
			.loadAllRelationIds()
			.getMany();

		return raw.map((item) => TypeOrmUserMapper.toObject(item));
	}

	async update(input: EnterpriseMemberRepoInterfaces.update): Promise<void> {
		const modifications = {
			name: input.name?.value,
			CPF: input.CPF?.value,
			phoneNumber: input.phoneNumber?.value,
		};

		for (const rawKey in modifications) {
			const key = rawKey as keyof typeof modifications;
			if (!modifications[key]) delete modifications[key];
		}

		if (
			!modifications.CPF &&
			(modifications.name || modifications.phoneNumber)
		)
			return await this.updateOnlyUser(input.id.value, {
				phoneNumber: input.phoneNumber?.value,
				name: input.name?.value,
			});

		if (
			modifications.CPF &&
			(modifications.name || modifications.phoneNumber)
		)
			return await this.updateUserAndEnterpriseMemberTable(
				input.id.value,
				modifications,
			);

		if (
			modifications.CPF &&
			!modifications.name &&
			!modifications.phoneNumber
		)
			return await this.updateOnlyEnterpriseMemberTable(
				input.id.value,
				modifications.CPF,
			);
	}

	private async updateOnlyUser(
		id: string,
		modifications: Record<string, string | undefined>,
	) {
		await this.dataSource
			.getRepository(TypeOrmUserEntity)
			.createQueryBuilder()
			.update('users')
			.set(modifications)
			.where('id = :id', { id })
			.execute();
	}

	private async updateOnlyEnterpriseMemberTable(id: string, CPF: string) {
		await this.dataSource
			.getRepository(TypeOrmEnterpriseMemberEntity)
			.createQueryBuilder()
			.update('enterprise_members')
			.set({ CPF })
			.where('user_id = :id', { id })
			.execute();
	}

	private async updateUserAndEnterpriseMemberTable(
		id: string,
		modifications: Record<string, string | undefined>,
	) {
		await this.dataSource.transaction(async (t) => {
			await t
				.getRepository(TypeOrmUserEntity)
				.createQueryBuilder()
				.update('users')
				.set({
					name: modifications?.name,
					phoneNumber: modifications?.phoneNumber,
				})
				.where('id = :id', { id })
				.execute();

			await t
				.getRepository(TypeOrmEnterpriseMemberEntity)
				.createQueryBuilder()
				.update('enterprise_members')
				.set({ CPF: modifications?.CPF })
				.where('user_id = :id', { id })
				.execute();
		});
	}

	async remove(input: EnterpriseMemberRepoInterfaces.remove): Promise<void> {
		await this.dataSource.transaction(async (t) => {
			await t
				.createQueryBuilder()
				.delete()
				.from('users')
				.where('id = :id', { id: input.id.value })
				.execute();
		});
	}
}
