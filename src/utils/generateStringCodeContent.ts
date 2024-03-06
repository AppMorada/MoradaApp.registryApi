import { Invite } from '@app/entities/invite';
import { User } from '@app/entities/user';

export interface IGenerateInviteKeyProps {
	invite: Invite;
}

/**
 * Feito para gerar uma string com base nos dados do usuário e sua relação com o condomínio
 **/
export function generateStringCodeContent(input: IGenerateInviteKeyProps) {
	const key = `[ID(${input.invite.id.value})].[RECIPIENT(${input.invite.recipient.value})].[LEVEL(${input.invite.code})].[CONDOMINIUMID(${input.invite.condominiumId.value})]`;
	return key;
}

export function generateStringCodeContentBasedOnUser(input: { user: User }) {
	const key = `[ID(${input.user.id.value})].[EMAIL(${input.user.email.value})].[CREATEDAT(${input.user.createdAt})]`;
	return key;
}
