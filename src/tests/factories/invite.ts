import { UUID } from '@app/entities/VO';
import { Invite, IInputPropsInvite } from '@app/entities/invite';

type TOverride = Partial<IInputPropsInvite>;
export function inviteFactory(input: TOverride = {}, id?: string) {
	return new Invite(
		{
			memberId: UUID.genV4().value,
			code: '123456789123456789',
			recipient: 'johndoe@email.com',
			condominiumId: UUID.genV4().value,
			...input,
		},
		id,
	);
}
