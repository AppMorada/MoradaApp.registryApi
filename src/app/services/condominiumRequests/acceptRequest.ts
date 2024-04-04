import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { CondominiumRequestRepoWriteOps } from '@app/repositories/condominiumRequest/write';
import { UUID } from '@app/entities/VO';
import { CommunityInfos } from '@app/entities/communityInfos';
import { CondominiumMember } from '@app/entities/condominiumMember';

interface IProps {
	userId: string;
	condominiumId: string;
}

@Injectable()
export class AcceptCondominiumRequestService implements IService {
	constructor(
		private readonly condominiumRequest: CondominiumRequestRepoWriteOps,
	) {}

	async exec(input: IProps) {
		const condominiumMember = new CondominiumMember({
			condominiumId: input.condominiumId,
			userId: input.userId,
			role: 0,
		});
		const communityInfo = new CommunityInfos({
			memberId: condominiumMember.id.value,
		});

		await this.condominiumRequest.acceptRequest({
			userId: new UUID(input.userId),
			condominiumMember,
			communityInfo,
		});
	}
}
