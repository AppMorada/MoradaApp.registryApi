import { Invite } from '@app/entities/invite';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { User } from '@app/entities/user';

export interface IGenerateInviteKeyProps {
	invite: Invite;
}

export interface IGenerateStringCodeContentBasedOnUser {
	user: User;
	uniqueRegistry: UniqueRegistry;
}

/**
 * Feito para gerar uma string com base nos dados do usuário e sua relação com o condomínio
 **/
export function generateStringCodeContent(input: IGenerateInviteKeyProps) {
	const key = `[[RECIPIENT(${input.invite.recipient.value})].[LEVEL(${input.invite.code})].[CONDOMINIUMID(${input.invite.condominiumId.value})]`;
	return key;
}

export function generateStringCodeContentBasedOnUser(
	input: IGenerateStringCodeContentBasedOnUser,
) {
	const key = `[ID(${input.user.id.value})].[EMAIL(${input.uniqueRegistry.email.value})].[CREATEDAT(${input.user.createdAt})]`;
	return key;
}
