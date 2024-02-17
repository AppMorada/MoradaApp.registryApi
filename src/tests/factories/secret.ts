import { ISecretProps, Secret } from '@app/entities/secret';

type TOverride = Partial<ISecretProps>;

export function secretFactory(input: TOverride = {}) {
	return new Secret({
		key: 'simple-key',
		value: 'simple-value',
		...input,
	});
}
