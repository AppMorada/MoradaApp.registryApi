import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { TUniqueRegistryInObject } from '@app/mapper/uniqueRegistry';

type TOverride = Partial<TUniqueRegistryInObject>;

export function uniqueRegistryFactory(input: TOverride = {}, id?: string) {
	return new UniqueRegistry(
		{
			CPF: '501.545.681-63',
			email: 'johndoe@email.com',
			...input,
		},
		id,
	);
}
