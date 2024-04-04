import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { User } from '@app/entities/user';

export interface IGenerateStringCodeContentBasedOnUser {
	user: User;
	uniqueRegistry: UniqueRegistry;
}

export function generateStringCodeContentBasedOnUser(
	input: IGenerateStringCodeContentBasedOnUser,
) {
	const key = `[ID(${input.user.id.value})].[EMAIL(${input.uniqueRegistry.email.value})].[CREATEDAT(${input.user.createdAt})]`;
	return key;
}
