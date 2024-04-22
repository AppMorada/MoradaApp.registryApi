import { UUID } from '@app/entities/VO';
import { EmployeeMemberRepoReadOps } from '@app/repositories/employeeMember/read';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
	pruneSensitiveData?: boolean;
}

@Injectable()
export class GetEmployeeMemberByUserIdService implements IService {
	constructor(private readonly memberRepo: EmployeeMemberRepoReadOps) {}

	async exec(input: IProps) {
		const data = await this.memberRepo.getByUserId({
			id: new UUID(input.id),
		});
		if (!data) return { content: null };

		return {
			content: {
				user: data.user,
				uniqueRegistry: data.uniqueRegistry,
				worksOn: data.worksOn,
			},
		};
	}
}
