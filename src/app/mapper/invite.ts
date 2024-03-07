import { Invite } from '@app/entities/invite';

interface IConvertToObject {
	id?: string;
	recipient: string;
	condominiumId: string;
	memberId: string;
	code: string;
	createdAt?: Date;
}

export type TInviteInObject = Required<IConvertToObject>;

export class InviteMapper {
	static toClass(input: IConvertToObject): Invite {
		return new Invite(
			{
				...input,
			},
			input.id,
		);
	}

	static toObject(input: Invite): TInviteInObject {
		return {
			id: input.id.value,
			condominiumId: input.condominiumId.value,
			memberId: input.memberId.value,
			code: input.code,
			recipient: input.recipient.value,
			createdAt: input.createdAt,
		};
	}
}
