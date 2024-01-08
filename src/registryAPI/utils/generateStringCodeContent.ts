import { Level, Email, UUID } from '@registry:app/entities/VO';

export interface IGenerateInviteKeyProps {
	id: UUID;
	email: Email;
	requiredLevel?: Level;
	condominiumId?: UUID;
}

/**
 * Feito para gerar uma string com base nos dados do usuário e sua relação com o condomínio
 **/
export function generateStringCodeContent(input: IGenerateInviteKeyProps) {
	const key = `[ID(${input.id.value})].[EMAIL(${input.email.value})].[LEVEL(${
		input.requiredLevel?.value ?? 'UNKNOWN'
	})].[CONDOMINIUMID(${input.condominiumId?.value ?? 'UNKNOWN'})]`;
	return key;
}
