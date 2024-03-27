import { CondominiumMember } from '@app/entities/condominiumMember';
import { InMemoryContainer } from '../../inMemoryContainer';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { Condominium } from '@app/entities/condominium';
import { User } from '@app/entities/user';
import {
	EmployeeMemberRepoWriteOps,
	EmployeeMemberRepoWriteOpsInterfaces,
} from '@app/repositories/employeeMember/write';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

export class InMemoryEmployeeMembersWriteOps
implements EmployeeMemberRepoWriteOps
{
	calls = {
		create: 0,
		remove: 0,
		update: 0,
	};

	users: User[];
	condominiumMembers: CondominiumMember[];
	condominiums: Condominium[];
	uniqueRegistries: UniqueRegistry[];

	constructor(container: InMemoryContainer) {
		this.users = container.props.userArr;
		this.uniqueRegistries = container.props.uniqueRegistryArr;
		this.condominiums = container.props.condominiumArr;
		this.condominiumMembers = container.props.condominiumMemberArr;
	}

	async create(
		input: EmployeeMemberRepoWriteOpsInterfaces.create,
	): Promise<void> {
		++this.calls.create;

		const searchedCondominiumMember = this.condominiumMembers.find(
			(item) =>
				input.member.id.equalTo(item.id) ||
				ValueObject.compare(input.member.userId, item?.userId),
		);
		const searchedUser = this.users.find((item) =>
			ValueObject.compare(item.id, input.member?.userId),
		);

		if (searchedCondominiumMember || searchedUser)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'Employee member already exist',
			});

		const searchedUniqueRegistry = this.uniqueRegistries.find((item) =>
			item.email.equalTo(input.rawUniqueRegistry.email),
		);
		if (
			searchedUniqueRegistry &&
			ValueObject.compare(
				searchedUniqueRegistry.CPF,
				input.rawUniqueRegistry.CPF,
			)
		)
			throw new InMemoryError({
				entity: EntitiesEnum.uniqueRegistry,
				message: 'Unique registry doesn\'t match with the same data',
			});

		const uniqueRegistry = new UniqueRegistry(
			{
				email: input.rawUniqueRegistry.email.value,
				CPF: input.rawUniqueRegistry.CPF.value,
			},
			searchedUniqueRegistry?.id.value,
		);
		input.user.uniqueRegistryId = uniqueRegistry.id;
		input.member.uniqueRegistryId = uniqueRegistry.id;

		this.condominiumMembers.push(input.member);
		this.users.push(input.user);
		if (!searchedUniqueRegistry) this.uniqueRegistries.push(uniqueRegistry);
	}

	async remove(
		input: EmployeeMemberRepoWriteOpsInterfaces.remove,
	): Promise<void> {
		++this.calls.remove;
		const memberIndex = this.condominiumMembers.findIndex(
			(item) =>
				ValueObject.compare(item.userId, input.userId) &&
				item.condominiumId.equalTo(input.condominiumId) &&
				item.role.value === 1,
		);
		const userIndex = this.users.findIndex((item) =>
			ValueObject.compare(
				item.id,
				this.condominiumMembers[memberIndex]?.userId,
			),
		);

		if (memberIndex < 0 || userIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'Employee member doesn\'t exist',
			});

		this.condominiumMembers.splice(memberIndex, 1);
		this.users.splice(userIndex, 1);
	}

	async update(
		input: EmployeeMemberRepoWriteOpsInterfaces.update,
	): Promise<void> {
		++this.calls.update;
		const memberIndex = this.condominiumMembers.findIndex(
			(item) =>
				ValueObject.compare(item.userId, input.userId) &&
				item.condominiumId.equalTo(input.condominiumId) &&
				item.role.value === 1,
		);
		const userIndex = this.users.findIndex((item) =>
			ValueObject.compare(
				item.id,
				this.condominiumMembers[memberIndex]?.userId,
			),
		);

		if (memberIndex < 0 || userIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'Employee member doesn\'t exist',
			});

		const user = this.users[userIndex];
		user.name = input.name ?? user.name;
		user.phoneNumber = input.phoneNumber ?? user.phoneNumber;
	}
}
