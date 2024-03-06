import { UUID } from '@app/entities/VO';
import { EnterpriseMemberRepo } from '@app/repositories/enterpriseMember';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class GetEnterpriseMemberGroupByCondominiumIdService
implements IService
{
	constructor(private readonly memberRepo: EnterpriseMemberRepo) {}

	async exec(input: IProps) {
		const data = await this.memberRepo.getGroupCondominiumId({
			condominiumId: new UUID(input.id),
		});
		return data.map((item) => ({
			id: item.id,
			name: item.name,
			email: item.email,
			phoneNumber: item.phoneNumber,
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
		}));
	}
}
