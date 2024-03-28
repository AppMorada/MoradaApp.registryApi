import { CondominiumRequest } from '@app/entities/condominiumRequest';

export interface ICondominiumRequestConvertToObject {
	userId: string;
	condominiumId: string;
	createdAt?: Date;
}

export type TCondominiumRequestInObject =
	Required<ICondominiumRequestConvertToObject>;

export class CondominiumRequestMapper {
	static toClass(input: TCondominiumRequestInObject): CondominiumRequest {
		return new CondominiumRequest({
			...input,
		});
	}

	static toObject(input: CondominiumRequest): TCondominiumRequestInObject {
		return {
			condominiumId: input.condominiumId.value,
			userId: input.userId.value,
			createdAt: input.createdAt,
		};
	}
}
