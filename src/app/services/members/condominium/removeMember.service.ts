import { UUID } from '@app/entities/VO';
import { CondominiumMemberRepo } from '@app/repositories/condominiumMember';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class RemoveCondominiumMemberService implements IService {
	constructor(private readonly memberRepo: CondominiumMemberRepo) {}

	async exec(input: IProps) {
		await this.memberRepo.remove({ id: new UUID(input.id) });
	}
}
