import { UUID } from '@app/entities/VO';
import { ICondominiumMemberInObject } from '@app/mapper/condominiumMember';
import { IUniqueRegistryInObject } from '@app/mapper/uniqueRegistry';
import { IUserInObject } from '@app/mapper/user';

export namespace EmployeeMemberRepoReadOpsInterfaces {
	export interface getByCondominiumId {
		condominiumId: UUID;
	}

	export interface getByCondominiumIdReturn {
		condominiumMemberInfos: ICondominiumMemberInObject;
		uniqueRegistry: IUniqueRegistryInObject;
		user: Omit<IUserInObject, 'password' | 'tfa'>;
	}

	export interface getByUserId {
		id: UUID;
	}

	export interface getByUserIdReturn {
		worksOn: ICondominiumMemberInObject[];
		uniqueRegistry: IUniqueRegistryInObject;
		user: IUserInObject;
	}
}

export abstract class EmployeeMemberRepoReadOps {
	abstract getByUserId(
		input: EmployeeMemberRepoReadOpsInterfaces.getByUserId,
	): Promise<
		EmployeeMemberRepoReadOpsInterfaces.getByUserIdReturn | undefined
	>;

	abstract getGroupCondominiumId(
		input: EmployeeMemberRepoReadOpsInterfaces.getByCondominiumId,
	): Promise<EmployeeMemberRepoReadOpsInterfaces.getByCondominiumIdReturn[]>;
}
