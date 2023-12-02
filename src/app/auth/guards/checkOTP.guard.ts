import { CryptAdapter } from '@app/adapters/crypt';
import { OTP } from '@app/entities/OTP';
import { Code } from '@app/entities/VO/code';
import { Email } from '@app/entities/VO/email';
import { GuardErrors } from '@app/errors/guard';
import { OTPRepo } from '@app/repositories/otp';
import { UserRepo } from '@app/repositories/user';
import { LaunchOTPDTO } from '@infra/http/DTO/launch-otp.DTO';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { checkClassValidatorErrors } from '@utils/convertValidatorErr';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';

@Injectable()
export class CheckOTPGuard implements CanActivate {
	constructor(
		private readonly otpRepo: OTPRepo,
		private readonly userRepo: UserRepo,
		private readonly crypt: CryptAdapter,
	) {}

	private async searchByUser(email: Email) {
		const user = await this.userRepo.find({ email });
		if (!user)
			throw new GuardErrors({
				message: 'Usuário não existe, cancelando operação',
			});

		return user;
	}

	private async getContent(body: LaunchOTPDTO) {
		const email = new Email(body.email);
		const user = await this.searchByUser(email);

		const otp = new OTP({
			userId: user.id,
			code: new Code(body.OTP),
			condominiumId: user.condominiumId,
			requiredLevel: user.level,
		});
		const searchedOTP = await this.otpRepo.find({ email });

		if (
			!searchedOTP ||
			otp.userId !== searchedOTP.userId ||
			otp.condominiumId !== searchedOTP.condominiumId
		)
			throw new GuardErrors({
				message: 'OTP não existe',
			});

		return { otp, hashedOtp: searchedOTP, email };
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

		const { otp, hashedOtp, email } = await this.getContent(body);
		await this.validate(otp, hashedOtp);

		const user = await this.searchByUser(email);

		req.inMemoryData = {
			...req.inMemoryData,
			user,
			otp,
		};

		return true;
	}
}
