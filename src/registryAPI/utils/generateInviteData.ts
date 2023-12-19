import { Email } from '@registry:app/entities/VO/email';
import { Level } from '@registry:app/entities/VO/level';

export interface IGenerateInviteKeyProps {
	otpId: string;
	email: Email;
	condominiumId: string;
	requiredLevel?: Level;
}

export function generateInviteInput(input: IGenerateInviteKeyProps) {
	const key = `[ID(${input.otpId})].[CONDOMINIUMID(${
		input.condominiumId
	})].[EMAIL(${input.email.value})].[LEVEL(${
		input.requiredLevel?.value ?? 0
	})]`;

	return key;
}
