import { CPF, Name, PhoneNumber, UUID } from '@app/entities/VO';
import { EnterpriseMemberRepo } from '@app/repositories/enterpriseMember';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
	name?: string;
	CPF?: string;
	phoneNumber?: string;
}

@Injectable()
export class UpdateEnterpriseMemberService implements IService {
	constructor(private readonly memberRepo: EnterpriseMemberRepo) {}

	async exec(input: IProps) {
		await this.memberRepo.update({
			id: new UUID(input.id),
			name: input.name ? new Name(input.name) : undefined,
			CPF: input.CPF ? new CPF(input.CPF) : undefined,
			phoneNumber: input.phoneNumber
				? new PhoneNumber(input.phoneNumber)
				: undefined,
		});
	}
}
