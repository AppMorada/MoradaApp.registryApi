import { UUID } from '@app/entities/VO';
import { EmployeeMemberRepo } from '@app/repositories/employeeMember';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
	pruneSensitiveData?: boolean;
}

@Injectable()
export class GetEmployeeMemberByUserIdService implements IService {
	constructor(private readonly memberRepo: EmployeeMemberRepo) {}

	async exec(input: IProps) {
		const data = await this.memberRepo.getByUserId({
			id: new UUID(input.id),
		});
		if (!data) return { content: null };

		const userRef = data.user as any;
		delete userRef.password;
		delete userRef.tfa;

		return {
			content: {
				user: userRef,
				uniqueRegistry: data.uniqueRegistry,
				worksOn: data.worksOn,
			},
		};
	}
}
