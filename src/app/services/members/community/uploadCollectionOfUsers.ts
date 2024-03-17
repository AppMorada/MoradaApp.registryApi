import { Injectable } from '@nestjs/common';
import { IService } from '../../_IService';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { GenInviteService } from '../../invites/genInvite.service';
import {
	CommunityMemberRepo,
	CommunityMemberRepoInterfaces,
} from '@app/repositories/communityMember';
import { Condominium } from '@app/entities/condominium';
import { User } from '@app/entities/user';
import { CommunityInfos } from '@app/entities/communityInfos';
import { CPF, Email } from '@app/entities/VO';

interface IBuildInformations {
	CPF: CPF;
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
		CPF: string;
	}>;
}

@Injectable()
export class UploadCollectionOfMembersService implements IService {
	constructor(
		private readonly condominiumMemberRepo: CommunityMemberRepo,
		private readonly genInvite: GenInviteService,
	) {}

	private async buildInformations(input: IBuildInformations) {
		const rawUniqueRegistry = {
			CPF: input.CPF,
			email: input.email,
		};

		const condominiumMember = new CondominiumMember({
			condominiumId: input.condominium.id.value,
		});
		const { invite, sendInviteOnEmail } = await this.genInvite.exec({
			condominiumId: input.condominium.id.value,
			recipient: rawUniqueRegistry.email.value,
			CPF: rawUniqueRegistry.CPF.value,
			memberId: condominiumMember.id.value,
		});
		const communityInfos = new CommunityInfos({
			apartmentNumber: input.apartmentNumber,
			block: input.block,
			memberId: condominiumMember.id.value,
		});

		return {
			invite,
			communityInfos,
			condominiumMember,
			sendInviteOnEmail,
			rawUniqueRegistry,
		};
	}

	async exec(input: IProps): Promise<void> {
		const membersInfo: CommunityMemberRepoInterfaces.createMany = {
			members: [],
		};
		const sendEmailForMember: Array<() => Promise<void>> = [];

		for (const item of input.members) {
			const {
				sendInviteOnEmail,
				invite,
				condominiumMember,
				communityInfos,
				rawUniqueRegistry,
			} = await this.buildInformations({
				CPF: new CPF(item.CPF),
				email: new Email(item.email),
				condominium: input.condominium,
				block: item.block,
				apartmentNumber: item.apartmentNumber,
			});

			membersInfo.members.push({
				content: condominiumMember,
				rawUniqueRegistry,
				invite,
				communityInfos,
			});
			sendEmailForMember.push(sendInviteOnEmail);
		}

		await this.condominiumMemberRepo.createMany({ ...membersInfo });
		for (const emailHandler of sendEmailForMember) {
			await emailHandler();
		}
	}
}
