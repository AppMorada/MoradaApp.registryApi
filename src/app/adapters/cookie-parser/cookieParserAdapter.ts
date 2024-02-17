import * as cookieParser from 'cookie-parser';
import {
	CookieAdapter,
	IValidateSignedCookie,
	TValidateSignedCookieReturn,
} from '../cookie';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CookieParserAdapter implements CookieAdapter {
	validateSignedCookie(
		input: IValidateSignedCookie,
	): TValidateSignedCookieReturn {
		return cookieParser.signedCookie(input.cookie, input.key);
	}
}
