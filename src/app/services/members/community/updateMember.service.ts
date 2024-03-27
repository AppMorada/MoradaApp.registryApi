import { ApartmentNumber, Block, UUID } from '@app/entities/VO';
import { CommunityMemberWriteOpsRepo } from '@app/repositories/communityMember/write';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
	apartmentNumber?: number;
	block?: string;
}

@Injectable()
export class UpdateCommunityMemberService implements IService {
	constructor(private readonly memberRepo: CommunityMemberWriteOpsRepo) {}

	async exec(input: IProps) {
		await this.memberRepo.update({
			id: new UUID(input.id),
			apartmentNumber: input.apartmentNumber
				? new ApartmentNumber(input.apartmentNumber)
				: undefined,
			block: input.block ? new Block(input.block) : undefined,
		});
	}
}
