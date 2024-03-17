import { UUID } from '@app/entities/VO';
import {
	CondominiumMember,
	ICondominiumMemberInput,
} from '@app/entities/condominiumMember';

type TOverride = Partial<ICondominiumMemberInput>;

export function condominiumMemberFactory(input: TOverride = {}, id?: string) {
	return new CondominiumMember(
		{
			condominiumId: UUID.genV4().value,
			...input,
		},
		id,
	);
}
