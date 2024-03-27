import { UUID } from '@app/entities/VO';
import { CommunityInfoMapper } from '@app/mapper/communityInfo';
import {
	CondominiumMemberMapper,
	ICondominiumMemberInObject,
} from '@app/mapper/condominiumMember';
import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';
import { UserMapper } from '@app/mapper/user';
import { CommunityMemberRepoReadOps } from '@app/repositories/communityMember/read';
import { UserRepoReadOps } from '@app/repositories/user/read';
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
		private readonly memberRepo: CommunityMemberRepoReadOps,
		private readonly userRepo: UserRepoReadOps,
	) {}

	private async getUserData(userId: string) {
		const { user } = await this.userRepo.find({
			key: new UUID(userId),
			safeSearch: true,
		});
		const userRef = UserMapper.toObject(user) as any;

		delete userRef.password;
		delete userRef.tfa;

		return userRef;
	}
	private async getMemberData(memberId: UUID, pruneSensitiveData?: boolean) {
		const searchedData = await this.memberRepo.getById({ id: memberId });
		if (!searchedData) return null;

		const memberAsObject = CondominiumMemberMapper.toObject(
			searchedData.member,
		);
		const uniqueRegistry = UniqueRegistryMapper.toObject(
			searchedData.uniqueRegistry,
		);

		if (pruneSensitiveData) delete uniqueRegistry.CPF;

		return {
			memberAsObject,
			communityInfos: CommunityInfoMapper.toObject(
				searchedData.communityInfos,
			),
			uniqueRegistry: UniqueRegistryMapper.toObject(
				searchedData.uniqueRegistry,
			),
		};
	}

	private async getContent(memberId: UUID, pruneSensitiveData?: boolean) {
		const searchedMemberData = await this.getMemberData(
			memberId,
			pruneSensitiveData,
		);
		if (!searchedMemberData) return null;

		const user = searchedMemberData.memberAsObject.userId
			? await this.getUserData(searchedMemberData.memberAsObject.userId)
			: null;

		searchedMemberData.memberAsObject.userId = user?.id ?? null;
		return {
			member: searchedMemberData?.memberAsObject,
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
