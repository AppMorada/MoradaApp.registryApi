import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CryptAdapter } from '@registry:app/adapters/crypt';
import { OTP } from '@registry:app/entities/OTP';
import { Email } from '@registry:app/entities/VO';
import { GuardErrors } from '@registry:app/errors/guard';
import { OTPRepo } from '@registry:app/repositories/otp';
import { UserRepo } from '@registry:app/repositories/user';
import { LaunchOTPDTO } from '@registry:infra/http/DTO/launchOTP.DTO';
import { checkClassValidatorErrors } from '@registry:utils/convertValidatorErr';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';

@Injectable()
export class CheckOTPGuard implements CanActivate {
	constructor(
		private readonly otpRepo: OTPRepo,
		private readonly userRepo: UserRepo,
		private readonly crypt: CryptAdapter,
	) {}

	private async getContent(body: LaunchOTPDTO, req: Request) {
		const email = new Email(body.email);
		const user =
			req?.inMemoryData?.user ??
			(await this.userRepo.find({
				key: email,
				safeSearch: true,
			}));

		const otp = new OTP({
			userId: user.id.value,
			code: body.OTP,
			ttl: 1000 * 60 * 2,
		});
		const searchedOTP = await this.otpRepo.find({ email });

		if (!searchedOTP)
			throw new GuardErrors({
				message: 'OTP não existe',
			});

		return { otp, hashedOtp: searchedOTP, email, user };
	}

	private async validate(otp: OTP, hash: OTP) {
		const response = await this.crypt.compare({
			data: otp.code.value,
			hashedData: hash.code.value,
		});
		if (!response)
			throw new GuardErrors({
				message: 'OTP inválido',
			});
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		const body = plainToClass(LaunchOTPDTO, req.body);
		await checkClassValidatorErrors({ body });

		const { otp, hashedOtp, user, email } = await this.getContent(
			body,
			req,
		);
		await this.validate(otp, hashedOtp);
		await this.otpRepo.delete({ email });

		req.inMemoryData = {
			...req.inMemoryData,
			user,
			otp,
		};

		return true;
	}
}
