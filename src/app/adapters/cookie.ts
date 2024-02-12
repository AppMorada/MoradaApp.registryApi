export type TValidateSignedCookieReturn =
	| Promise<string | false>
	| string
	| false;

export interface IValidateSignedCookie {
	cookie: string;
	key: string;
}

export abstract class CookieAdapter {
	abstract validateSignedCookie(
		data: IValidateSignedCookie,
	): TValidateSignedCookieReturn;
}
