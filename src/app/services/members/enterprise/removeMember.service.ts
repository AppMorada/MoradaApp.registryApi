import { UUID } from '@app/entities/VO';
import { EnterpriseMemberRepo } from '@app/repositories/enterpriseMember';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class RemoveEntepriseMemberService implements IService {
	constructor(private readonly memberRepo: EnterpriseMemberRepo) {}

	async exec(input: IProps) {
		await this.memberRepo.remove({ id: new UUID(input.id) });
	}
}
