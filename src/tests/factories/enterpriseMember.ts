import { UUID } from '@app/entities/VO';
import {
	EnterpriseMember,
	IEnterpriseMemberInput,
} from '@app/entities/enterpriseMember';

type TOverride = Partial<IEnterpriseMemberInput>;

export function enterpriseMemberFactory(input: TOverride = {}, id?: string) {
	return new EnterpriseMember(
		{
			CPF: '11122233396',
			condominiumId: UUID.genV4().value,
			userId: UUID.genV4().value,
			...input,
		},
		id,
	);
}
