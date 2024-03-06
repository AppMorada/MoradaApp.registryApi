import { UUID } from '@app/entities/VO';
import {
	EnterpriseMemberMapper,
	TEnterpriseMemberInObject,
} from '@app/mapper/enterpriseMember';
import { UserMapper } from '@app/mapper/user';
import { EnterpriseMemberRepo } from '@app/repositories/enterpriseMember';
import { UserRepo } from '@app/repositories/user';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

export interface IGetByUserIdServiceUserData {
	name: string;
	email: string;
	CPF?: string;
	phoneNumber?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export type TGetByUserIdServiceReturnContent = TEnterpriseMemberInObject & {
	userData: IGetByUserIdServiceUserData | null;
};

interface IProps {
	id: string;
	pruneSensitiveData?: boolean;
}

@Injectable()
export class GetEnterpriseMemberByIdService implements IService {
	constructor(
		private readonly memberRepo: EnterpriseMemberRepo,
		private readonly userRepo: UserRepo,
	) {}

	private async getUserData(userId: UUID) {
		const user = await this.userRepo.find({ key: userId });
		if (!user) return null;

		const data = UserMapper.toObject(user) as any;
		delete data.password;
		delete data.tfa;

		return data;
	}

	private async getMemberData(memberId: UUID, pruneSensitiveData?: boolean) {
		const member = await this.memberRepo.getById({ id: memberId });
		if (!member) return null;

		const memberAsObject = EnterpriseMemberMapper.toObject(member);
		if (!pruneSensitiveData) return memberAsObject;

		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { CPF: _, ...unsensitiveInfos } = memberAsObject;
		return unsensitiveInfos;
	}

	private async getContent(memberId: UUID, pruneSensitiveData?: boolean) {
		const member = await this.getMemberData(memberId, pruneSensitiveData);
		const user = member?.userId
			? await this.getUserData(new UUID(member?.userId))
			: null;

		if (!member && !user) return null;

		return {
			...member,
			userData: user,
		};
	}

	async exec(input: IProps) {
		const memberId = new UUID(input.id);
		const content = await this.getContent(
			memberId,
			input?.pruneSensitiveData,
		);
		return { content };
	}
}
