import { UUID } from '@app/entities/VO';
import { EnterpriseMemberMapper } from '@app/mapper/enterpriseMember';
import { EnterpriseMemberRepo } from '@app/repositories/enterpriseMember';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class GetEnterpriseMemberByUserIdService implements IService {
	constructor(private readonly memberRepo: EnterpriseMemberRepo) {}

	async exec(input: IProps) {
		const data = await this.memberRepo.getByUserId({
			id: new UUID(input.id),
		});
		if (!data) return { content: null };

		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { userId: _, ...rest } = EnterpriseMemberMapper.toObject(data);
		return {
			content: rest,
		};
	}
}
