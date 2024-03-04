import { CondominiumMember } from '@app/entities/condominiumMember';

export interface IConvertToObject {
	id?: string;
	condominiumId: string;
	userId?: string | null;
	c_email: string;
	hierarchy: number;
	apartmentNumber?: number | null;
	block?: string | null;
	autoEdit: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ICondominiumMemberInObject {
	id: string;
	condominiumId: string;
	userId?: string | null;
	c_email: string;
	hierarchy: number;
	apartmentNumber?: number | null;
	block?: string | null;
	autoEdit: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export class CondominiumMemberMapper {
	static toClass({ id, ...rest }: IConvertToObject): CondominiumMember {
		return new CondominiumMember({ ...rest }, id);
	}

	static toObject(input: CondominiumMember): ICondominiumMemberInObject {
		return {
			id: input.id.value,
			condominiumId: input.condominiumId.value,
			hierarchy: input.hierarchy.value,
			block: input.block ? input.block.value : input.block,
			apartmentNumber: input.apartmentNumber
				? input.apartmentNumber.value
				: input.apartmentNumber,
			c_email: input.c_email.value,
			userId: input.userId?.value,
			autoEdit: input.autoEdit,
			updatedAt: input.updatedAt,
			createdAt: input.createdAt,
		};
	}
}
