import { UUID } from '@app/entities/VO';
import { CommunityMemberReadOps } from '@app/repositories/communityMember/read';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
	pruneSensitiveData?: boolean;
}

@Injectable()
export class GetCommunityMemberGroupByCondominiumIdService implements IService {
	constructor(
		private readonly memberRepoGetGroup: CommunityMemberReadOps.GetByCondominiumId,
	) {}

	async exec(input: IProps) {
		const data = await this.memberRepoGetGroup.exec({
			condominiumId: new UUID(input.id),
		});

		if (input.pruneSensitiveData)
			return data.map((item) => {
				delete item.uniqueRegistry.CPF;
				return item;
			});
		return data;
	}
}
