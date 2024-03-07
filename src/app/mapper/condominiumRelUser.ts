import { CondominiumRelUser } from '@app/entities/condominiumRelUser';

export interface ICondominiumRelUserInObject {
	id: string;
	userId: string;
	condominiumId: string;
	block?: string | null;
	apartmentNumber?: number | null;
	level: number;
	updatedAt?: Date;
}

export type TCondominiumRelUserToObject = {
	id: string;
	userId: string;
	condominiumId: string;
	block?: string | null;
	apartmentNumber?: number | null;
	level: number;
	updatedAt: Date;
};

export class CondominiumRelUserMapper {
	static toClass({ id, ...input }: ICondominiumRelUserInObject) {
		return new CondominiumRelUser({ ...input }, id);
	}

	static toObject(input: CondominiumRelUser): TCondominiumRelUserToObject {
		return {
			id: input.id.value,
			userId: input.userId.value,
			condominiumId: input.condominiumId.value,
			block: input.block ? input.block.value : input.block,
			level: input.level.value,
			updatedAt: input.updatedAt,
			apartmentNumber: input.apartmentNumber
				? input.apartmentNumber.value
				: input.apartmentNumber,
		};
	}
}
