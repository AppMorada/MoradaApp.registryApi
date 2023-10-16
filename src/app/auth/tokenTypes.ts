export enum TokenType {
	createCondominium = 'Condominium Creation',
}

export interface ICondominiumJwt {
	sub: string;
	type: string;
	iat: number;
	exp: number;
}
