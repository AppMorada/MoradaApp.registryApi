import { Invite } from '@app/entities/invite';

interface IConvertToObject {
	id?: string;
	recipient: string;
	condominiumId: string;
	CPF: string;
	hierarchy: number;
	createdAt?: Date;
}

export type TInviteInObject = Required<IConvertToObject>;

export class InviteMapper {
	/**
	 * Método usado para converter um objeto de convite em classe
	 * @param input - Deve conter os dados em forma de objeto
	 **/
	static toClass(input: IConvertToObject): Invite {
		return new Invite(
			{
				...input,
			},
			input.id,
		);
	}

	/**
	 * Método usado para converter uma classe de convite em objeto
	 * @param input - Deve conter os dados em forma de classe
	 **/
	static toObject(input: Invite): TInviteInObject {
		return {
			id: input.id.value,
			condominiumId: input.condominiumId.value,
			CPF: input.CPF.value,
			hierarchy: input.hierarchy.value,
			recipient: input.recipient.value,
			createdAt: input.createdAt,
		};
	}
}
