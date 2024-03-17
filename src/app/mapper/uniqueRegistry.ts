import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { TReplace } from '@utils/replace';

export interface IUniqueRegistryInObject {
	id: string;
	CPF?: string | null;
	email: string;
}

export type TUniqueRegistryInObject = TReplace<
	IUniqueRegistryInObject,
	{ id?: string }
>;

export class UniqueRegistryMapper {
	static toClass({ id, ...rest }: IUniqueRegistryInObject): UniqueRegistry {
		return new UniqueRegistry(rest, id);
	}

	static toObject(input: UniqueRegistry): IUniqueRegistryInObject {
		return {
			id: input.id.value,
			email: input.email.value,
			CPF: input.CPF ? input.CPF?.value : input.CPF,
		};
	}
}
