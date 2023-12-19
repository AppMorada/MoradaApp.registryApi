import { OTP } from '@registry:app/entities/OTP';
import { Email } from '@registry:app/entities/VO/email';

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
	abstract create(input: ICreateOTPInput): Promise<void>;
	abstract find(input: IFindOTPInput): Promise<OTP | undefined>;
	abstract delete(input: IDeleteOTPInput): Promise<void>;
}
