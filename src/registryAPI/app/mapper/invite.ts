import { Invite } from '@registry:app/entities/invite';

interface IConvertToObject {
	id?: string;
	email: string;
	ttl: number;
	expiresAt?: Date;
	condominiumId: string;
	type: number;
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
			email: input.email.value,
			ttl: input.ttl,
			expiresAt: input.expiresAt,
			type: input.type.value,
			condominiumId: input.condominiumId.value,
		};
	}
}
