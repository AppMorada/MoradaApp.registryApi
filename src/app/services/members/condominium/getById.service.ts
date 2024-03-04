import { UUID } from '@app/entities/VO';
import { CondominiumMember } from '@app/entities/condominiumMember';
import {
	CondominiumMemberMapper,
	ICondominiumMemberInObject,
} from '@app/mapper/condominiumMember';
import { UserMapper } from '@app/mapper/user';
import { CondominiumMemberRepo } from '@app/repositories/condominiumMember';
import { UserRepo } from '@app/repositories/user';
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
export class GetCondominiumMemberByIdService implements IService {
	constructor(
		private readonly memberRepo: CondominiumMemberRepo,
		private readonly userRepo: UserRepo,
	) {}

	private pruneSensitiveData(content: IGetByUserIdServiceUserData) {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { CPF: _, ...rest } = content;
		return { ...rest };
	}

	private async getUserData(
		userId: UUID,
		pruneSensitiveData?: boolean,
	): Promise<IGetByUserIdServiceUserData | null> {
		const user = await this.userRepo.find({ key: userId });
		if (!user) return null;

		/* eslint-disable @typescript-eslint/no-unused-vars */
		const {
			email: ____,
			id: ___,
			password: _,
			tfa: __,
			...rest
		} = UserMapper.toObject(user);
		return pruneSensitiveData ? this.pruneSensitiveData(rest) : { ...rest };
	}

	private async parseContent(
		data: CondominiumMember,
		pruneSensitiveData?: boolean,
	) {
		const { userId, ...parsedData } =
			CondominiumMemberMapper.toObject(data);
		const userData = data.userId
			? await this.getUserData(data.userId, pruneSensitiveData)
			: null;

		return {
			userId: userId ?? null,
			...parsedData,
			userData,
		};
	}

	async exec(input: IProps) {
		const data = await this.memberRepo.getById({ id: new UUID(input.id) });
		if (data)
			return {
				content: await this.parseContent(
					data,
					input?.pruneSensitiveData,
				),
			};

		return { content: null };
	}
}
