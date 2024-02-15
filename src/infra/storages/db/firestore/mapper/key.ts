import { Key } from '@app/entities/key';

export interface IToFlatReturn {
	name: string;
	prev_Content?: string;
	prev_BuildedAt?: number;
	actual_Content: string;
	actual_BuildedAt: number;
	ttl: number;
	renewTime: number;
}

export class FirestoreKeyMapper {
	static toFlat(input: Key): IToFlatReturn {
		return {
			name: input.name,
			ttl: input.ttl,
			actual_Content: input.actual.content,
			actual_BuildedAt: input.actual.buildedAt,
			prev_Content: input.prev?.content,
			prev_BuildedAt: input.prev?.buildedAt
				? input.prev.buildedAt
				: undefined,
			renewTime: input.renewTime,
		};
	}

	static fromFlatToClass(input: IToFlatReturn) {
		return new Key({
			actual: {
				buildedAt: input.actual_BuildedAt,
				content: input.actual_Content,
			},
			prev:
				input.prev_BuildedAt && input.prev_Content
					? {
						buildedAt: input.prev_BuildedAt,
						content: input.prev_Content,
					}
					: undefined,
			name: input.name,
			id: input.name,
			renewTime: input.renewTime,
			ttl: input.ttl,
		});
	}
}
