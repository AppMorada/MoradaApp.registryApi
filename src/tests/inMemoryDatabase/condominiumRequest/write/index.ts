import { Level } from '@app/entities/VO';
import { CommunityInfos } from '@app/entities/communityInfos';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { CondominiumRequest } from '@app/entities/condominiumRequest';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
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
				item.condominiumId.equalTo(input.condominiumId),
		);
		const condominiumMemberIndex = this.condominiumMembers.findIndex(
			(item) =>
				ValueObject.compare(item.userId, input.userId) &&
				item.condominiumId.equalTo(input.condominiumId),
		);
		if (condominiumRequestIndex < 0 || condominiumMemberIndex < 0)
			throw new InMemoryError({
				message:
					'Condominium request doesn\'t exist or member already exist',
				entity: EntitiesEnum.condominiumRequest,
			});

		const condominiumMember =
			this.condominiumMembers[condominiumRequestIndex];
		const communityInfos = new CommunityInfos({
			memberId: condominiumMember.id.value,
		});

		condominiumMember.role = new Level(0);
		this.communityInfos.push(communityInfos);
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

		const requesterCondominiumMember = new CondominiumMember({
			condominiumId: input.request.condominiumId.value,
			userId: input.request.userId.value,
			uniqueRegistryId: input.request.uniqueRegistryId.value,
			role: -1,
		});

		this.condominiumMembers.push(requesterCondominiumMember);
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
