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
import { CondominiumMemberMapper } from '@app/mapper/condominiumMember';
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

		if (user && member && uniqueRegistry) {
			const parsedUser = UserMapper.toObject(user) as any;
			delete parsedUser.password;
			delete parsedUser.uniqueRegistryId;

			return {
				user: parsedUser,
				uniqueRegistry: UniqueRegistryMapper.toObject(uniqueRegistry),
				worksOn: member.map((item) => {
					const parsedCondominiumMember =
						CondominiumMemberMapper.toObject(item) as any;
					delete parsedCondominiumMember.uniqueRegistryId;
					delete parsedCondominiumMember.userId;

					return parsedCondominiumMember;
				}),
			};
		}

		return undefined;
	}

	async getGroupCondominiumId(
		input: EmployeeMemberRepoReadOpsInterfaces.getByCondominiumId,
	): Promise<EmployeeMemberRepoReadOpsInterfaces.getByCondominiumIdReturn[]> {
		++this.calls.getGroupCondominiumId;
		const employees: EmployeeMemberRepoReadOpsInterfaces.getByCondominiumIdReturn[] =
			[];

		for (const user of this.users) {
			const condominiumMemberInfos = this.condominiumMembers.find(
				(item) =>
					item?.userId &&
					ValueObject.compare(user.id, item.userId) &&
					item.role.value === 1 &&
					item.condominiumId.equalTo(input.condominiumId),
			);
			const parsedCondominiumMemberInfos = condominiumMemberInfos
				? (CondominiumMemberMapper.toObject(
					condominiumMemberInfos,
				) as any)
				: undefined;
			delete parsedCondominiumMemberInfos?.uniqueRegistryId;
			delete parsedCondominiumMemberInfos?.userId;

			const uniqueRegistry = this.uniqueRegistries.find((item) =>
				user.uniqueRegistryId.equalTo(item.id),
			);

			const parsedUser = UserMapper.toObject(user) as any;
			delete parsedUser.uniqueRegistryId;
			delete parsedUser.password;

			if (condominiumMemberInfos && uniqueRegistry)
				employees.push({
					user: parsedUser,
					uniqueRegistry:
						UniqueRegistryMapper.toObject(uniqueRegistry),
					condominiumMemberInfos: parsedCondominiumMemberInfos,
				});
		}

		return employees;
	}
}
