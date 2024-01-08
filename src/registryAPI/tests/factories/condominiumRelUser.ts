import { UUID } from '@registry:app/entities/VO';
import {
	CondominiumRelUser,
	IInputCondominiumRelUser,
} from '@registry:app/entities/condominiumRelUser';

type TOverride = Partial<IInputCondominiumRelUser>;

export function condominiumRelUserFactory(input: TOverride = {}, id?: string) {
	return new CondominiumRelUser(
		{
			apartmentNumber: 32768,
			condominiumId: UUID.genV4().value,
			userId: UUID.genV4().value,
			block: 'A12',
			...input,
		},
		id,
	);
}
