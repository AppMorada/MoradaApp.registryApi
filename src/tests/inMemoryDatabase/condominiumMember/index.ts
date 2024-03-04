import { CondominiumMember } from '@app/entities/condominiumMember';
import {
	CondominiumMemberRepo,
	CondominiumMemberRepoInterfaces,
} from '@app/repositories/condominiumMember';
import { InMemoryContainer } from '../inMemoryContainer';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { Condominium } from '@app/entities/condominium';
import { User } from '@app/entities/user';
import {
	CondominiumMemberMapper,
	ICondominiumMemberInObject,
} from '@app/mapper/condominiumMember';

export class InMemoryCondominiumMembers implements CondominiumMemberRepo {
	public calls = {
		getByUserId: 0,
		getById: 0,
		getGroupCondominiumId: 0,
		create: 0,
		createMany: 0,
		checkByUserAndCondominiumId: 0,
		remove: 0,
		update: 0,
	};

	public users: User[];
	public condominiumMembers: CondominiumMember[];
	public condominiums: Condominium[];

	constructor(container: InMemoryContainer) {
		this.users = container.props.userArr;
		this.condominiumMembers = container.props.condominiumMemberArr;
		this.condominiums = container.props.condominiumArr;
	}

	async create(input: CondominiumMemberRepoInterfaces.create): Promise<void> {
		++this.calls.create;

		const member = this.condominiumMembers.find(
			(item) =>
				input.member.id.equalTo(item.id) ||
				(input.member.c_email.equalTo(item.c_email) &&
					input.member.condominiumId.equalTo(item.condominiumId) &&
					ValueObject.compare(input.member.userId, item.userId) &&
					input.member.condominiumId.equalTo(item.condominiumId)),
		);

		if (member)
			throw new InMemoryError({
				entity: EntitiesEnum.condominiumMember,
				message: 'Condominium member already exist',
			});

		this.condominiumMembers.push(input.member);
	}

	async createMany(
		input: CondominiumMemberRepoInterfaces.createMany,
	): Promise<void> {
		++this.calls.createMany;

		input.members.forEach((item) => {
			this.create({ member: item.content });
		});
	}

	async remove(input: CondominiumMemberRepoInterfaces.remove): Promise<void> {
		++this.calls.remove;
		const memberIndex = this.condominiumMembers.findIndex((item) =>
			item.id.equalTo(input.id),
		);
		if (memberIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.condominiumMember,
				message: 'Condominium member doesn\'t exist',
			});

		this.condominiumMembers.splice(memberIndex, 1);
	}

	async getById(
		input: CondominiumMemberRepoInterfaces.getById,
	): Promise<CondominiumMember | undefined> {
		++this.calls.getById;
		const condominiumMember = this.condominiumMembers.find((item) =>
			ValueObject.compare(item.id, input.id),
		);

		return condominiumMember;
	}

	async getByUserId(
		input: CondominiumMemberRepoInterfaces.getByUserId,
	): Promise<ICondominiumMemberInObject[]> {
		++this.calls.getByUserId;
		const condominiumMember = this.condominiumMembers.filter((item) =>
			ValueObject.compare(item.userId, input.id),
		);

		return condominiumMember.map((item) =>
			CondominiumMemberMapper.toObject(item),
		);
	}

	async checkByUserAndCondominiumId(
		input: CondominiumMemberRepoInterfaces.getByUserIdAndCondominiumId,
	): Promise<number> {
		++this.calls.checkByUserAndCondominiumId;
		let counter = 0;
		for (const item of this.condominiumMembers) {
			if (
				input.condominiumId.equalTo(item.condominiumId) &&
				ValueObject.compare(input.userId, item?.userId)
			) {
				++counter;
			}
		}
		return counter;
	}

	async getGroupCondominiumId(
		input: CondominiumMemberRepoInterfaces.getByCondominiumId,
	): Promise<CondominiumMemberRepoInterfaces.getByCondominiumIdReturn[]> {
		++this.calls.getGroupCondominiumId;
		const condominiumMember = this.condominiumMembers.filter((item) =>
			ValueObject.compare(item.condominiumId, input.condominiumId),
		);

		return condominiumMember.map((item) => {
			const data = CondominiumMemberMapper.toObject(item);
			return {
				id: data.id,
				c_email: data.c_email,
				apartmentNumber: data.apartmentNumber ?? null,
				block: data.block ?? null,
				userId: data.userId ?? null,
				updatedAt: data.updatedAt,
				createdAt: data.createdAt,
			};
		});
	}

	async update(input: CondominiumMemberRepoInterfaces.update): Promise<void> {
		++this.calls.update;
		const index = this.condominiumMembers.findIndex((item) =>
			item.id.equalTo(input.id),
		);

		if (index < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.condominiumMember,
				message: 'Condominium member doesn\'t exist',
			});

		const member = this.condominiumMembers[index];
		member.c_email = input.c_email ?? member.c_email;
		member.block = input.block ?? member.block;
		member.apartmentNumber =
			input.apartmentNumber ?? member.apartmentNumber;
	}
}
