export enum TokenType {
	accessToken = 'Access Token',
	refreshToken = 'Refresh Token',
}

export interface IAccessTokenBody {
	sub: string;
	type: string;
	content: {
		name: string;
		email: string;
		apartmentNumber: number | null;
		block: string | null;
		level: number;
		phoneNumber: string;
		createdAt: Date;
		updatedAt: Date;
	};
	iat: number;
	exp: number;
}

export interface IRefreshTokenBody {
	sub: string;
	type: string;
	email: string;
	iat: number;
	exp: number;
}
