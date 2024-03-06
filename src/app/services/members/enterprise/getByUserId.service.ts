import { UUID } from '@app/entities/VO';
import { EnterpriseMember } from '@app/entities/enterpriseMember';
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
export class GetEnterpriseMemberByUserIdService implements IService {
	constructor(
		private readonly memberRepo: EnterpriseMemberRepo,
		private readonly userRepo: UserRepo,
	) {}

	private pruneSensitiveData(content: IGetByUserIdServiceUserData) {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { CPF: _, ...rest } = content;
		return { ...rest };
	}

	private async getUserData(userId: UUID, pruneSensitiveData?: boolean) {
		const user = await this.userRepo.find({ key: userId });
		if (!user) return null;

		/* eslint-disable @typescript-eslint/no-unused-vars */
		const {
			id: ___,
			password: _,
			tfa: __,
			...rest
		} = UserMapper.toObject(user);
		return pruneSensitiveData ? this.pruneSensitiveData(rest) : { ...rest };
	}

	private async parseContent(
		data: EnterpriseMember,
		pruneSensitiveData?: boolean,
	) {
		const parsedData = EnterpriseMemberMapper.toObject(data);
		const userData = data.userId
			? await this.getUserData(data.userId, pruneSensitiveData)
			: null;

		return {
			...parsedData,
			userData,
		};
	}

	async exec(input: IProps) {
		const data = await this.memberRepo.getByUserId({
			id: new UUID(input.id),
		});
		if (!data) return { content: null };

		const content = await this.parseContent(
			data,
			input?.pruneSensitiveData,
		);
		return { content };
	}
}
