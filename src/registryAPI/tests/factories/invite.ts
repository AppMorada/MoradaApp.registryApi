import { UUID } from '@registry:app/entities/VO';
import { Invite, IInputPropsInvite } from '@registry:app/entities/invite';

type TOverride = Partial<IInputPropsInvite>;
export function inviteFactory(input: TOverride = {}, id?: string) {
	return new Invite(
		{
			type: 0,
			email: 'johndoe@email.com',
			ttl: 1000,
			condominiumId: UUID.genV4().value,
			...input,
		},
		id,
	);
}
