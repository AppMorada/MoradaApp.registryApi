import { UUID } from '@app/entities/VO';
import { CondominiumMemberRepo } from '@app/repositories/condominiumMember';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class GetCondominiumMemberByUserIdService implements IService {
	constructor(private readonly memberRepo: CondominiumMemberRepo) {}

	async exec(input: IProps) {
		const raw = await this.memberRepo.getByUserId({
			id: new UUID(input.id),
		});
		if (!raw) return { content: null };

		const data = raw.map((item) => {
			/* eslint-disable @typescript-eslint/no-unused-vars */
			const { userId: _, ...rest } = item;
			return rest;
		});

		return {
			content: data,
		};
	}
}
