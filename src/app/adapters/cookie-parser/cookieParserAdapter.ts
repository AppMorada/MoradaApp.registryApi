import { signedCookie } from 'cookie-parser';
import {
	CookieAdapter,
	IValidateSignedCookie,
	TValidateSignedCookieReturn,
} from '../cookie';

export class CookieParserAdapter implements CookieAdapter {
	validateSignedCookie(
		input: IValidateSignedCookie,
	): TValidateSignedCookieReturn {
		return signedCookie(input.cookie, input.key);
	}
}
