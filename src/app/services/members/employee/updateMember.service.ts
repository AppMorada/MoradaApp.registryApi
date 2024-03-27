import { Name, PhoneNumber, UUID } from '@app/entities/VO';
import { EmployeeMemberRepoWriteOps } from '@app/repositories/employeeMember/write';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	userId: string;
	condominiumId: string;
	name?: string;
	phoneNumber?: string;
}

@Injectable()
export class UpdateEmployeeMemberService implements IService {
	constructor(private readonly memberRepo: EmployeeMemberRepoWriteOps) {}

	async exec(input: IProps) {
		await this.memberRepo.update({
			userId: new UUID(input.userId),
			condominiumId: new UUID(input.condominiumId),
			name: input.name ? new Name(input.name) : undefined,
			phoneNumber: input.phoneNumber
				? new PhoneNumber(input.phoneNumber)
				: undefined,
		});
	}
}
