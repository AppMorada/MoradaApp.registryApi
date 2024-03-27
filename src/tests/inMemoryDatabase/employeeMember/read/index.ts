import { CondominiumMember } from '@app/entities/condominiumMember';
import { InMemoryContainer } from '../../inMemoryContainer';
import { ValueObject } from '@app/entities/entities';
import { Condominium } from '@app/entities/condominium';
import { User } from '@app/entities/user';
import { UserMapper } from '@app/mapper/user';
import {
	EmployeeMemberRepoReadOps,
	EmployeeMemberRepoReadOpsInterfaces,
} from '@app/repositories/employeeMember/read';
import {
	CondominiumMemberMapper,
	ICondominiumMemberInObject,
} from '@app/mapper/condominiumMember';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';

export class InMemoryEmployeeMembersReadOps
implements EmployeeMemberRepoReadOps
{
	calls = {
		getByUserId: 0,
		getById: 0,
		getGroupCondominiumId: 0,
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

	async getByUserId(
		input: EmployeeMemberRepoReadOpsInterfaces.getByUserId,
	): Promise<
		EmployeeMemberRepoReadOpsInterfaces.getByUserIdReturn | undefined
	> {
		++this.calls.getByUserId;
		const member = this.condominiumMembers.filter(
			(item) =>
				ValueObject.compare(item.userId, input.id) &&
				item.role.value === 1,
		);
		const user = this.users.find((item) => item.id.equalTo(input.id));
		const uniqueRegistry = this.uniqueRegistries.find((item) =>
			ValueObject.compare(user?.uniqueRegistryId, item.id),
		);

		return user && member && uniqueRegistry
			? {
				user: UserMapper.toObject(user),
				uniqueRegistry:
						UniqueRegistryMapper.toObject(uniqueRegistry),
				worksOn: member.map((item) =>
					CondominiumMemberMapper.toObject(item),
				),
			}
			: undefined;
	}

	async getGroupCondominiumId(
		input: EmployeeMemberRepoReadOpsInterfaces.getByCondominiumId,
	): Promise<EmployeeMemberRepoReadOpsInterfaces.getByCondominiumIdReturn[]> {
		++this.calls.getGroupCondominiumId;
		const employees: EmployeeMemberRepoReadOpsInterfaces.getByCondominiumIdReturn[] =
			[];

		for (const user of this.users) {
			let condominiumMemberInfos:
				| CondominiumMember
				| ICondominiumMemberInObject
				| undefined;
			condominiumMemberInfos = this.condominiumMembers.find(
				(item) =>
					item?.userId &&
					ValueObject.compare(user.id, item.userId) &&
					item.role.value === 1 &&
					item.condominiumId.equalTo(input.condominiumId),
			);
			condominiumMemberInfos = condominiumMemberInfos
				? CondominiumMemberMapper.toObject(condominiumMemberInfos)
				: undefined;
			const uniqueRegistry = this.uniqueRegistries.find((item) =>
				user.uniqueRegistryId.equalTo(item.id),
			);

			if (condominiumMemberInfos && uniqueRegistry)
				employees.push({
					user: UserMapper.toObject(user),
					uniqueRegistry:
						UniqueRegistryMapper.toObject(uniqueRegistry),
					condominiumMemberInfos,
				});
		}

		return employees;
	}
}
