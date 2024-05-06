import { UUID } from '@app/entities/VO';
import { EmployeeMemberReadOps } from '@app/repositories/employeeMember/read';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
	pruneSensitiveData?: boolean;
}

@Injectable()
export class GetEmployeeMemberByUserIdService implements IService {
	constructor(
		private readonly memberRepoGetByUserId: EmployeeMemberReadOps.GetByUserId,
	) {}

	async exec(input: IProps) {
		const data = await this.memberRepoGetByUserId.exec({
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
