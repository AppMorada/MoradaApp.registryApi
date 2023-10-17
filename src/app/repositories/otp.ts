import { OTP } from '@app/entities/OTP';

export interface ICreateOTPInput {
	otp: OTP;
}

export interface IFindOTPInput {
	userId: string;
}

export interface IDeleteOTPInput {
	userId: string;
}

export abstract class OTPRepo {
	abstract create(input: ICreateOTPInput): Promise<void>;
	abstract find(input: IFindOTPInput): Promise<OTP | undefined>;
	abstract delete(input: IDeleteOTPInput): Promise<void>;
}
