import { ApartmentNumber, Block, Email, UUID } from '@app/entities/VO';
import { CondominiumMemberRepo } from '@app/repositories/condominiumMember';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
	c_email?: string;
	apartmentNumber?: number;
	block?: string;
}

@Injectable()
export class UpdateCondominiumMemberService implements IService {
	constructor(private readonly memberRepo: CondominiumMemberRepo) {}

	async exec(input: IProps) {
		await this.memberRepo.update({
			id: new UUID(input.id),
			apartmentNumber: input.apartmentNumber
				? new ApartmentNumber(input.apartmentNumber)
				: undefined,
			c_email: input.c_email ? new Email(input.c_email) : undefined,
			block: input.block ? new Block(input.block) : undefined,
		});
	}
}
