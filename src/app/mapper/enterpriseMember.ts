import { EnterpriseMember } from '@app/entities/enterpriseMember';

export interface IEnterpriseMemberConvertToObject {
	id?: string;
	condominiumId: string;
	userId: string;
	hierarchy: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export type TEnterpriseMemberInObject =
	Required<IEnterpriseMemberConvertToObject>;

export class EnterpriseMemberMapper {
	static toClass({
		id,
		...rest
	}: IEnterpriseMemberConvertToObject): EnterpriseMember {
		return new EnterpriseMember({ ...rest }, id);
	}

	static toObject(input: EnterpriseMember): TEnterpriseMemberInObject {
		return {
			id: input.id.value,
			condominiumId: input.condominiumId.value,
			hierarchy: input.hierarchy.value,
			userId: input.userId.value,
			updatedAt: input.updatedAt,
			createdAt: input.createdAt,
		};
	}
}
