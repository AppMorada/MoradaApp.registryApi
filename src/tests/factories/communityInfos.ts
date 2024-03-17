import { UUID } from '@app/entities/VO';
import {
	CommunityInfos,
	ICondominiumInfosInput,
} from '@app/entities/communityInfos';

type TOverride = Partial<ICondominiumInfosInput>;

export function communityInfosFactory(input: TOverride = {}) {
	return new CommunityInfos({
		memberId: UUID.genV4().value,
		apartmentNumber: 32768,
		block: 'A12',
		...input,
	});
}
