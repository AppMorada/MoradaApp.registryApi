import { Injectable } from '@nestjs/common';
import { IService } from '../../_IService';
import { CondominiumMember } from '@app/entities/condominiumMember';
import {
	CommunityMemberWriteOpsRepo,
	CommunityMemberRepoWriteOpsInterfaces,
} from '@app/repositories/communityMember/write';
import { Condominium } from '@app/entities/condominium';
import { User } from '@app/entities/user';
import { CommunityInfos } from '@app/entities/communityInfos';
import { Email } from '@app/entities/VO';
import { SendInviteService } from '@app/services/invites/sendInvite.service';

interface IBuildInformations {
	email: Email;
	condominium: Condominium;
	apartmentNumber: number;
	block: string;
}

interface IProps {
	condominium: Condominium;
	user: User;
	members: Array<{
		email: string;
		apartmentNumber: number;
		block: string;
	}>;
}

@Injectable()
export class UploadCollectionOfMembersService implements IService {
	constructor(
		private readonly condominiumMemberRepo: CommunityMemberWriteOpsRepo,
		private readonly sendInvite: SendInviteService,
	) {}

	private async buildInformations(input: IBuildInformations) {
		const rawUniqueRegistry = {
			email: input.email,
		};

		const condominiumMember = new CondominiumMember({
			condominiumId: input.condominium.id.value,
		});
		const communityInfos = new CommunityInfos({
			apartmentNumber: input.apartmentNumber,
			block: input.block,
			memberId: condominiumMember.id.value,
		});

		return {
			communityInfos,
			condominiumMember,
			rawUniqueRegistry,
		};
	}

	async exec(input: IProps): Promise<void> {
		const membersInfo: CommunityMemberRepoWriteOpsInterfaces.createMany = {
			members: [],
		};
		const sendEmailForMember: Array<() => Promise<void>> = [];

		for (const item of input.members) {
			const { condominiumMember, communityInfos, rawUniqueRegistry } =
				await this.buildInformations({
					email: new Email(item.email),
					condominium: input.condominium,
					block: item.block,
					apartmentNumber: item.apartmentNumber,
				});

			membersInfo.members.push({
				content: condominiumMember,
				rawUniqueRegistry,
				communityInfos,
			});
			sendEmailForMember.push(
				async () =>
					await this.sendInvite.exec({
						condominium: input.condominium,
						recipient: item.email,
					}),
			);
		}

		await this.condominiumMemberRepo.createMany({ ...membersInfo });
		for (const emailHandler of sendEmailForMember) {
			await emailHandler();
		}
	}
}
