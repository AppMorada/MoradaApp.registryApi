import { UUID } from '@app/entities/VO';
import {
	EnterpriseMember,
	IEnterpriseMemberInput,
} from '@app/entities/enterpriseMember';

type TOverride = Partial<IEnterpriseMemberInput>;

export function enterpriseMemberFactory(input: TOverride = {}, id?: string) {
	return new EnterpriseMember(
		{
			hierarchy: 0,
			condominiumId: UUID.genV4().value,
			userId: UUID.genV4().value,
			...input,
		},
		id,
	);
}
