import { CondominiumRequest } from '@app/entities/condominiumRequest';
import { TReplace } from '@utils/replace';

export interface ICondominiumRequestConvertToObject {
	userId: string;
	condominiumId: string;
	uniqueRegistryId: string;
	message?: string | null;
	createdAt?: Date;
}

export type TCondominiumRequestInObject = TReplace<
	ICondominiumRequestConvertToObject,
	{ message?: string | null }
>;

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
			uniqueRegistryId: input.uniqueRegistryId.value,
			message: input.message,
			createdAt: input.createdAt,
		};
	}
}
