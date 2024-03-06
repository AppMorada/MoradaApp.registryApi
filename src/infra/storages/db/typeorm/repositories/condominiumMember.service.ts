import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../consts';
import { DataSource, Repository } from 'typeorm';
import { TypeOrmCondominiumMemberEntity } from '../entities/condominiumMember.entity';
import { TypeOrmCondominiumMemberMapper } from '../mapper/condominiumMember';
import { CondominiumMember } from '@app/entities/condominiumMember';
import {
	CondominiumMemberRepo,
	CondominiumMemberRepoInterfaces,
} from '@app/repositories/condominiumMember';
import { ICondominiumMemberInObject } from '@app/mapper/condominiumMember';

@Injectable()
export class TypeOrmCondominiumMemberRepo implements CondominiumMemberRepo {
	constructor(
		@Inject(typeORMConsts.entity.condominiumMember)
		private readonly condominiumMemberRepo: Repository<TypeOrmCondominiumMemberEntity>,
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
	) {}

	async create(input: CondominiumMemberRepoInterfaces.create): Promise<void> {
		const member = TypeOrmCondominiumMemberMapper.toTypeOrm(input.member);
		await this.condominiumMemberRepo.insert({ ...member });
	}

	async createMany(
		input: CondominiumMemberRepoInterfaces.createMany,
	): Promise<void> {
		await this.dataSource.transaction(async (t) => {
			for (let i = 0; i < input.members.length; i++) {
				const preparedData = TypeOrmCondominiumMemberMapper.toTypeOrm(
					input.members[i].content,
				);
				await t.insert('condominium_members', preparedData);
			}
		});
	}

	async checkByUserAndCondominiumId(
		input: CondominiumMemberRepoInterfaces.getByUserIdAndCondominiumId,
	): Promise<number> {
		const count = await this.dataSource
			.getRepository(TypeOrmCondominiumMemberEntity)
			.createQueryBuilder('condominium_member')
			.where('condominium_member.user_id = :user_id', {
				user_id: input.userId.value,
			})
			.andWhere('condominium_member.condominium_id = :condominium_id', {
				condominium_id: input.condominiumId.value,
			})
			.loadAllRelationIds()
			.getCount();

		return count;
	}

	async getByUserId(
		input: CondominiumMemberRepoInterfaces.getByUserId,
	): Promise<ICondominiumMemberInObject[]> {
		const raw = await this.dataSource
			.getRepository(TypeOrmCondominiumMemberEntity)
			.createQueryBuilder('condominium_member')
			.where('condominium_member.user_id = :user_id', {
				user_id: input.id.value,
			})
			.loadAllRelationIds()
			.getMany();

		return raw.map((item) => TypeOrmCondominiumMemberMapper.toObject(item));
	}

	async getById(
		input: CondominiumMemberRepoInterfaces.getByUserId,
	): Promise<CondominiumMember | undefined> {
		const raw = await this.dataSource
			.getRepository(TypeOrmCondominiumMemberEntity)
			.createQueryBuilder('condominium_member')
			.where('condominium_member.id = :id', { id: input.id.value })
			.loadAllRelationIds()
			.getOne();

		return raw ? TypeOrmCondominiumMemberMapper.toClass(raw) : undefined;
	}

	async getGroupCondominiumId(
		input: CondominiumMemberRepoInterfaces.getByCondominiumId,
	): Promise<CondominiumMemberRepoInterfaces.getByCondominiumIdReturn[]> {
		const raw = await this.dataSource
			.getRepository(TypeOrmCondominiumMemberEntity)
			.createQueryBuilder('condominium_member')
			.where('condominium_member.condominium_id = :condominium_id', {
				condominium_id: input.condominiumId.value,
			})
			.loadAllRelationIds()
			.getMany();

		return raw.map((item) => {
			const data = TypeOrmCondominiumMemberMapper.toObject(item);
			return {
				id: data.id,
				userId: data?.userId ?? null,
				c_email: data.c_email,
				block: data.block ?? null,
				CPF: data.CPF,
				apartmentNumber: data.apartmentNumber ?? null,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			};
		});
	}

	async update(input: CondominiumMemberRepoInterfaces.update): Promise<void> {
		const modifications = {
			block: input.block?.value,
			c_email: input.c_email?.value,
			apartmentNumber: input.apartmentNumber?.value,
		};

		for (const rawKey in modifications) {
			const key = rawKey as keyof typeof modifications;
			if (!modifications[key]) delete modifications[key];
		}

		await this.dataSource
			.createQueryBuilder()
			.update('condominium_members')
			.set(modifications)
			.where('id = :id', { id: input.id.value })
			.execute();
	}

	async remove(input: CondominiumMemberRepoInterfaces.remove): Promise<void> {
		await this.condominiumMemberRepo.delete({ id: input.id.value });
	}
}
