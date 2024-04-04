import { CommunityInfos } from '@app/entities/communityInfos';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { CondominiumRequest } from '@app/entities/condominiumRequest';
import { EntitiesEnum } from '@app/entities/entities';
import { User } from '@app/entities/user';
import {
	CondominiumRequestRepoWriteOps,
	CondominiumRequestRepoWriteOpsInterfaces,
} from '@app/repositories/condominiumRequest/write';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

export class InMemoryCondominiumRequestWriteOps
implements CondominiumRequestRepoWriteOps
{
	users: User[];
	condominiumMembers: CondominiumMember[];
	communityInfos: CommunityInfos[];
	condominiumRequests: CondominiumRequest[];

	calls = {
		acceptRequest: 0,
		create: 0,
		removeByUserIdAndCondominiumId: 0,
	};

	constructor(container: InMemoryContainer) {
		this.condominiumMembers = container.props.condominiumMemberArr;
		this.communityInfos = container.props.communityInfosArr;
		this.users = container.props.userArr;
		this.condominiumRequests = container.props.condominiumRequestArr;
	}

	async acceptRequest(
		input: CondominiumRequestRepoWriteOpsInterfaces.accept,
	): Promise<void> {
		++this.calls.acceptRequest;

		const condominiumRequestIndex = this.condominiumRequests.findIndex(
			(item) =>
				item.userId.equalTo(input.userId) &&
				item.condominiumId.equalTo(
					input.condominiumMember.condominiumId,
				),
		);
		const condominiumMember = this.condominiumMembers.find((item) =>
			item.id.equalTo(input.condominiumMember.id),
		);
		const communityInfo = this.communityInfos.find((item) =>
			item.memberId.equalTo(input.condominiumMember.id),
		);
		if (condominiumRequestIndex < 0 || condominiumMember || communityInfo)
			throw new InMemoryError({
				message:
					'Condominium request doesn\'t exist or member already exist',
				entity: EntitiesEnum.condominiumRequest,
			});

		const newCondominiumMember = input.condominiumMember.dereference();
		newCondominiumMember.userId = input.userId;
		this.condominiumMembers.push(newCondominiumMember);
		this.communityInfos.push(input.communityInfo);
		this.condominiumRequests.splice(condominiumRequestIndex, 1);
	}

	async create(
		input: CondominiumRequestRepoWriteOpsInterfaces.create,
	): Promise<void> {
		++this.calls.create;

		const condominiumRequest = this.condominiumRequests.find(
			(item) =>
				item.userId.equalTo(input.request.userId) &&
				item.condominiumId.equalTo(input.request.condominiumId),
		);
		if (condominiumRequest)
			throw new InMemoryError({
				message: 'Condominium request doesn\'t exist',
				entity: EntitiesEnum.condominiumRequest,
			});

		this.condominiumRequests.push(input.request);
	}

	async removeByUserIdAndCondominiumId(
		input: CondominiumRequestRepoWriteOpsInterfaces.remove,
	): Promise<void> {
		++this.calls.removeByUserIdAndCondominiumId;

		const condominiumRequestIndex = this.condominiumRequests.findIndex(
			(item) =>
				item.userId.equalTo(input.userId) &&
				item.condominiumId.equalTo(input.condominiumId),
		);
		if (condominiumRequestIndex < 0)
			throw new InMemoryError({
				message: 'Condominium request doesn\'t exist',
				entity: EntitiesEnum.condominiumRequest,
			});

		this.condominiumRequests.splice(condominiumRequestIndex, 1);
	}
}
