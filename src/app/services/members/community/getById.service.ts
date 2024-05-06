import { UUID } from '@app/entities/VO';
import { ICondominiumMemberInObject } from '@app/mapper/condominiumMember';
import { UserMapper } from '@app/mapper/user';
import { CommunityMemberReadOps } from '@app/repositories/communityMember/read';
import { UserReadOps } from '@app/repositories/user/read';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

export interface IGetByUserIdServiceUserData {
	name: string;
	CPF?: string;
	phoneNumber?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export type TGetByUserIdServiceReturnContent = ICondominiumMemberInObject & {
	userData: IGetByUserIdServiceUserData | null;
};

interface IProps {
	id: string;
	pruneSensitiveData?: boolean;
}

@Injectable()
export class GetCommunityMemberByIdService implements IService {
	constructor(
		private readonly memberRepoGetById: CommunityMemberReadOps.GetById,
		private readonly userRepoRead: UserReadOps.Read,
	) {}

	private async getUserData(userId: string) {
		const { user } = await this.userRepoRead.exec({
			key: new UUID(userId),
			safeSearch: true,
		});
		const userRef = UserMapper.toObject(user) as any;

		delete userRef.uniqueRegistryId;
		delete userRef.password;
		delete userRef.tfa;

		return userRef;
	}
	private async getMemberData(memberId: UUID, pruneSensitiveData?: boolean) {
		const searchedData = await this.memberRepoGetById.exec({
			id: memberId,
		});
		if (!searchedData) return null;
		if (pruneSensitiveData) delete searchedData.uniqueRegistry.CPF;

		return {
			member: searchedData.member,
			communityInfos: searchedData.communityInfos,
			uniqueRegistry: searchedData.uniqueRegistry,
		};
	}

	private async getContent(memberId: UUID, pruneSensitiveData?: boolean) {
		const searchedMemberData = await this.getMemberData(
			memberId,
			pruneSensitiveData,
		);
		if (!searchedMemberData) return null;

		const user = searchedMemberData.member.userId
			? await this.getUserData(searchedMemberData.member.userId)
			: null;

		delete searchedMemberData.member.userId;
		return {
			member: searchedMemberData?.member,
			communityInfos: searchedMemberData?.communityInfos,
			userData: user,
			uniqueRegistry: searchedMemberData?.uniqueRegistry,
		};
	}

	async exec(input: IProps) {
		const memberId = new UUID(input.id);
		const content = await this.getContent(
			memberId,
			input?.pruneSensitiveData,
		);
		return { ...content };
	}
}
