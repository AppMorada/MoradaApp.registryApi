import { CondominiumMember } from '@app/entities/condominiumMember';
import {
	EnterpriseMemberRepoInterfaces,
	EnterpriseMemberRepo,
} from '@app/repositories/enterpriseMember';
import { InMemoryContainer } from '../inMemoryContainer';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { Condominium } from '@app/entities/condominium';
import { User } from '@app/entities/user';
import { EnterpriseMember } from '@app/entities/enterpriseMember';
import { IUserInObject, UserMapper } from '@app/mapper/user';

export class InMemoryEnterpriseMembers implements EnterpriseMemberRepo {
	public calls = {
		getByUserId: 0,
		getById: 0,
		getGroupCondominiumId: 0,
		create: 0,
		remove: 0,
		update: 0,
	};

	public users: User[];
	public enterpriseMembers: EnterpriseMember[];
	public condominiumMembers: CondominiumMember[];
	public condominiums: Condominium[];

	constructor(container: InMemoryContainer) {
		this.users = container.props.userArr;
		this.enterpriseMembers = container.props.enterpriseMemberArr;
		this.condominiums = container.props.condominiumArr;
		this.condominiumMembers = container.props.condominiumMemberArr;
	}

	async create(input: EnterpriseMemberRepoInterfaces.create): Promise<void> {
		++this.calls.create;

		const enterpriseMember = new EnterpriseMember({
			userId: input.member.userId.value,
			CPF: input.member.CPF.value,
			condominiumId: input.member.condominiumId.value,
		});

		const searchedEnterpriseMember = this.enterpriseMembers.find(
			(item) =>
				enterpriseMember.id.equalTo(item.id) ||
				enterpriseMember.userId.equalTo(item.userId),
		);
		const searchedCondominiumMember = this.condominiumMembers.find(
			(item) =>
				item.condominiumId.equalTo(enterpriseMember.condominiumId) &&
				ValueObject.compare(item.userId, enterpriseMember.userId),
		);
		const searchedUser = this.users.find((item) =>
			item.id.equalTo(enterpriseMember.userId),
		);

		if (
			searchedEnterpriseMember ||
			searchedCondominiumMember ||
			searchedUser
		)
			throw new InMemoryError({
				entity: EntitiesEnum.enterpriseMember,
				message: 'Enterprise member already exist',
			});

		this.enterpriseMembers.push(enterpriseMember);
		this.users.push(input.user);
	}

	async remove(input: EnterpriseMemberRepoInterfaces.remove): Promise<void> {
		++this.calls.remove;
		const memberIndex = this.enterpriseMembers.findIndex((item) =>
			item.id.equalTo(input.id),
		);
		if (memberIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.enterpriseMember,
				message: 'Enterprise member doesn\'t exist',
			});

		this.enterpriseMembers.splice(memberIndex, 1);
	}

	async getByUserId(
		input: EnterpriseMemberRepoInterfaces.getByUserId,
	): Promise<EnterpriseMember | undefined> {
		++this.calls.getByUserId;
		const member = this.enterpriseMembers.find((item) =>
			ValueObject.compare(item.userId, input.id),
		);

		return member;
	}

	async getById(
		input: EnterpriseMemberRepoInterfaces.getById,
	): Promise<EnterpriseMember | undefined> {
		++this.calls.getById;
		const member = this.enterpriseMembers.find((item) =>
			ValueObject.compare(item.id, input.id),
		);

		return member;
	}

	async getGroupCondominiumId(
		input: EnterpriseMemberRepoInterfaces.getByCondominiumId,
	): Promise<IUserInObject[]> {
		++this.calls.getGroupCondominiumId;
		const users: User[] = [];

		for (const member of this.enterpriseMembers) {
			if (!member.condominiumId.equalTo(input.condominiumId)) continue;

			const data = this.users.find((item) =>
				item.id.equalTo(member.userId),
			);
			if (data) users.push(data);
		}

		return users.map((item) => UserMapper.toObject(item));
	}

	async update(input: EnterpriseMemberRepoInterfaces.update): Promise<void> {
		++this.calls.update;
		const memberIndex = this.enterpriseMembers.findIndex((item) =>
			item.id.equalTo(input.id),
		);
		const userIndex = this.users.findIndex((item) =>
			ValueObject.compare(
				item.id,
				this.enterpriseMembers[memberIndex]?.userId,
			),
		);

		if (memberIndex < 0 || userIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.enterpriseMember,
				message: 'Enterprise member doesn\'t exist',
			});

		const user = this.users[userIndex];
		const member = this.enterpriseMembers[memberIndex];

		member.CPF = input.CPF ?? member.CPF;
		user.name = input.name ?? user.name;
		user.phoneNumber = input.phoneNumber ?? user.phoneNumber;
	}
}
