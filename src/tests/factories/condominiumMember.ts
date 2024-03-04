import { UUID } from '@app/entities/VO';
import {
	CondominiumMember,
	ICondominiumMemberInput,
} from '@app/entities/condominiumMember';

type TOverride = Partial<ICondominiumMemberInput>;

export function condominiumMemberFactory(input: TOverride = {}, id?: string) {
	return new CondominiumMember(
		{
			hierarchy: 0,
			condominiumId: UUID.genV4().value,
			c_email: 'jhondoe@email.com',
			autoEdit: false,
			apartmentNumber: 32768,
			block: 'A12',
			...input,
		},
		id,
	);
}
