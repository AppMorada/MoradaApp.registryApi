import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { CryptAdapter } from '@app/adapters/crypt';
import { OTPRepo } from '@app/repositories/otp';
import { Email } from '@app/entities/VO/email';
import { OTP } from '@app/entities/OTP';
import { generateInviteInput } from '@utils/generateInviteData';

interface IValidate {
	email: Email;
	code: string;
	otp: OTP;
}

@Injectable()
export class HmacInviteGuard implements CanActivate {
	constructor(
		private readonly crypt: CryptAdapter,
		private readonly otpRepo: OTPRepo,
	) {}

	private async validate(input: IValidate) {
		const key =
			!input.otp.requiredLevel || input.otp.requiredLevel.value <= 0
				? process.env.INVITE_TOKEN_KEY
				: input.otp.requiredLevel.value === 1
					? process.env.INVITE_ADMIN_TOKEN_KEY
					: process.env.INVITE_SUPER_ADMIN_TOKEN_KEY;

		const inviteData = generateInviteInput({
			condominiumId: input.otp.condominiumId,
			email: input.email,
			requiredLevel: input.otp.requiredLevel,
			otpId: input.otp.id,
		});
		const hmacRes = await this.crypt
			.hashWithHmac({ data: inviteData, key: key as string })
			.catch(() => {
				throw new UnauthorizedException();
			});

		const hmacValidation = hmacRes === input.code;
		const cryptValidation = await this.crypt.compare({
			data: input.code,
			hashedData: input.otp.code.value,
		});

		return hmacValidation && cryptValidation;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();

		const regex = /invite=([^&]+)/gm;
		const invite = regex.exec(req?._parsedUrl?.query ?? '') as string[];

		const email = req?.body?.email ? new Email(req.body.email) : undefined;
		if (!email) throw new UnauthorizedException();

		const otp = await this.otpRepo.find({ email });
		if (!otp) throw new UnauthorizedException();

		const validationRes = await this.validate({
			email,
			code:
				invite instanceof Array && invite.length >= 2 ? invite[1] : '',
			otp,
		});
		if (!validationRes) throw new UnauthorizedException();

		req.inMemoryData = otp;

		return true;
	}
}
