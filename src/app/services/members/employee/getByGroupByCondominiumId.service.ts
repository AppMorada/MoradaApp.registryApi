import { UUID } from '@app/entities/VO';
import { EmployeeMemberRepo } from '@app/repositories/employeeMember';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class GetEmployeeMemberGroupByCondominiumIdService implements IService {
	constructor(private readonly memberRepo: EmployeeMemberRepo) {}

	async exec(input: IProps) {
		const data = await this.memberRepo.getGroupCondominiumId({
			condominiumId: new UUID(input.id),
		});
		return data;
	}
}
