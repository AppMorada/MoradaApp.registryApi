import { CondominiumMember } from '@app/entities/condominiumMember';

export interface IConvertToObject {
	id?: string;
	condominiumId: string;
	uniqueRegistryId?: string;
	userId?: string | null;
	role: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ICondominiumMemberInObject {
	id: string;
	uniqueRegistryId: string;
	condominiumId: string;
	userId?: string | null;
	role: number;
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
			uniqueRegistryId: input.uniqueRegistryId.value,
			condominiumId: input.condominiumId.value,
			role: input.role.value,
			userId: input.userId?.value,
			updatedAt: input.updatedAt,
			createdAt: input.createdAt,
		};
	}
}
