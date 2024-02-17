import { IKeyProps, Key } from '@app/entities/key';

export class KeyMapper {
	static toClass(input: IKeyProps) {
		return new Key({ ...input });
	}

	static toObject(input: Key): IKeyProps {
		return {
			id: input.id,
			name: input.name,
			actual: {
				content: input.actual.content,
				buildedAt: input.actual.buildedAt,
			},
			prev: input.prev
				? {
					buildedAt: input.prev.buildedAt,
					content: input.prev.content,
				}
				: undefined,
			renewTime: input.renewTime,
			ttl: input.ttl,
		};
	}
}
