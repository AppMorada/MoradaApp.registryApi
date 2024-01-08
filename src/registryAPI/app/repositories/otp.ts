import { OTP } from '@registry:app/entities/OTP';
import { Email } from '@registry:app/entities/VO';

export interface ICreateOTPInput {
	otp: OTP;
	email: Email;
}

export interface IFindOTPInput {
	email: Email;
}

export interface IDeleteOTPInput {
	email: Email;
}

export abstract class OTPRepo {
	/** @deprecated */
	abstract create(input: ICreateOTPInput): Promise<void>;
	/** @deprecated */
	abstract find(input: IFindOTPInput): Promise<OTP | undefined>;
	/** @deprecated */
	abstract delete(input: IDeleteOTPInput): Promise<void>;
}
