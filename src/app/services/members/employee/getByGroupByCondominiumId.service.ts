import { UUID } from '@app/entities/VO';
import { EmployeeMemberReadOps } from '@app/repositories/employeeMember/read';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class GetEmployeeMemberGroupByCondominiumIdService implements IService {
	constructor(
		private readonly memberRepoGetGroupCondominiumId: EmployeeMemberReadOps.GetGroupByCondominiumId,
	) {}

	async exec(input: IProps) {
		const data = await this.memberRepoGetGroupCondominiumId.exec({
			condominiumId: new UUID(input.id),
		});
		return data;
	}
}
