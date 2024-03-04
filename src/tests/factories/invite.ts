import { UUID } from '@app/entities/VO';
import { Invite, IInputPropsInvite } from '@app/entities/invite';

type TOverride = Partial<IInputPropsInvite>;
export function inviteFactory(input: TOverride = {}, id?: string) {
	return new Invite(
		{
			hierarchy: 0,
			recipient: 'johndoe@email.com',
			CPF: '11122233396',
			condominiumId: UUID.genV4().value,
			...input,
		},
		id,
	);
}
