import { Injectable } from '@nestjs/common';
import { IService } from '../../_IService';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { GenInviteService } from '../../invites/genInvite.service';
import { CondominiumMemberRepo } from '@app/repositories/condominiumMember';

interface IProps {
	condominiumId: string;
	members: Array<{
		c_email: string;
		apartmentNumber: number;
		block: string;
		CPF: string;
	}>;
}

@Injectable()
export class UploadCollectionOfMembersService implements IService {
	constructor(
		private readonly condominiumMemberRepo: CondominiumMemberRepo,
		private readonly genInvite: GenInviteService,
	) {}

	async exec(input: IProps): Promise<void> {
		const content = input.members.map((item) => ({
			content: new CondominiumMember({
				apartmentNumber: item.apartmentNumber,
				block: item.block,
				condominiumId: input.condominiumId,
				c_email: item.c_email,
				CPF: item.CPF,
				autoEdit: false,
			}),
		}));

		await this.condominiumMemberRepo.createMany({
			members: content,
		});

		for (const item of content) {
			await this.genInvite.exec({
				condominiumId: item.content.condominiumId.value,
				recipient: item.content.c_email.value,
				CPF: item.content.CPF.value,
				memberId: item.content.id.value,
			});
		}
	}
}
