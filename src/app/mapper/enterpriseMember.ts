import { EnterpriseMember } from '@app/entities/enterpriseMember';

export interface IEnterpriseMemberConvertToObject {
	id?: string;
	condominiumId: string;
	CPF: string;
	userId: string;
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
			CPF: input.CPF.value,
			userId: input.userId.value,
			updatedAt: input.updatedAt,
			createdAt: input.createdAt,
		};
	}
}
