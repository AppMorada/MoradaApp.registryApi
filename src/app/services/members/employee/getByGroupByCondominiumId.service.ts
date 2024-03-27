import { UUID } from '@app/entities/VO';
import { EmployeeMemberRepoReadOps } from '@app/repositories/employeeMember/read';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class GetEmployeeMemberGroupByCondominiumIdService implements IService {
	constructor(private readonly memberRepo: EmployeeMemberRepoReadOps) {}

	async exec(input: IProps) {
		const data = await this.memberRepo.getGroupCondominiumId({
			condominiumId: new UUID(input.id),
		});
		return data;
	}
}
