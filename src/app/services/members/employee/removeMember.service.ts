import { UUID } from '@app/entities/VO';
import { EmployeeMemberRepoWriteOps } from '@app/repositories/employeeMember/write';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	condominiumId: string;
	userId: string;
}

@Injectable()
export class RemoveEmployeeMemberService implements IService {
	constructor(private readonly memberRepo: EmployeeMemberRepoWriteOps) {}

	async exec(input: IProps) {
		await this.memberRepo.remove({
			userId: new UUID(input.userId),
			condominiumId: new UUID(input.condominiumId),
		});
	}
}
