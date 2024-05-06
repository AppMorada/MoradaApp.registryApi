import { UUID } from '@app/entities/VO';
import { IUniqueRegistryInObject } from '@app/mapper/uniqueRegistry';

export namespace EmployeeMemberRepoReadOpsInterfaces {
	export interface performantCondominiumMember {
		id: string;
		condominiumId: string;
		uniqueRegistryId?: undefined;
		userId?: undefined;
		role: number;
		createdAt: Date;
		updatedAt: Date;
	}
	export interface performantUser {
		id: string;
		name: string;
		phoneNumber?: string | null;
		password?: undefined;
		uniqueRegistryId?: undefined;
		tfa: boolean;
		createdAt: Date;
		updatedAt: Date;
	}

	export interface getByCondominiumId {
		condominiumId: UUID;
	}

	export interface getByCondominiumIdReturn {
		condominiumMemberInfos: performantCondominiumMember;
		uniqueRegistry: IUniqueRegistryInObject;
		user: performantUser;
	}

	export interface getByUserId {
		id: UUID;
	}

	export interface getByUserIdReturn {
		worksOn: performantCondominiumMember[];
		uniqueRegistry: IUniqueRegistryInObject;
		user: performantUser;
	}
}

export namespace EmployeeMemberReadOps {
	export abstract class GetByUserId {
		abstract exec(
			input: EmployeeMemberRepoReadOpsInterfaces.getByUserId,
		): Promise<
			EmployeeMemberRepoReadOpsInterfaces.getByUserIdReturn | undefined
		>;
	}

	export abstract class GetGroupByCondominiumId {
		abstract exec(
			input: EmployeeMemberRepoReadOpsInterfaces.getByCondominiumId,
		): Promise<
			EmployeeMemberRepoReadOpsInterfaces.getByCondominiumIdReturn[]
		>;
	}
}
