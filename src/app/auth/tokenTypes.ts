export enum TokenType {
	createCondominium = 'Condominium Creation',
	accessToken = 'Access Token',
}

export interface IAccessTokenBody {
	sub: string;
	type: string;
	content: {
		name: string;
		email: string;
		CPF: string;
		apartmentNumber: number | null;
		block: string | null;
		level: number;
		phoneNumber: string;
		createdAt: Date;
		updatedAt: Date;
	};
}

export type TAccessTokenJwt = {
	iat: number;
	exp: number;
} & IAccessTokenBody;

export interface ICondominiumJwt {
	sub: string;
	type: string;
	iat: number;
	exp: number;
}
