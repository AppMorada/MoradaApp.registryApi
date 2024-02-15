import { IKeyProps, Key } from '@app/entities/key';

type TOverride = Partial<IKeyProps>;

export function keyFactory(input: TOverride = {}) {
	return new Key({
		name: 'default key',
		ttl: 60 * 60,
		actual: {
			content: 'default content',
			buildedAt: Date.now(),
		},
		...input,
	});
}
