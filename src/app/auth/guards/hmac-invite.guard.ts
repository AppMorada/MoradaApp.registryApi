import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { CryptAdapter } from '@app/adapters/crypt';
import { OTPRepo } from '@app/repositories/otp';
import { Email } from '@app/entities/VO/email';
import { Level } from '@app/entities/VO/level';

@Injectable()
export class HmacInviteGuard implements CanActivate {
	constructor(
		private readonly crypt: CryptAdapter,
		private readonly otpRepo: OTPRepo,
	) {}

	private async validate(email: Email, code: string, requiredLevel?: Level) {
		const key =
			!requiredLevel || requiredLevel.value <= 0
				? process.env.INVITE_TOKEN_KEY
				: requiredLevel.value === 1
					? process.env.INVITE_ADMIN_TOKEN_KEY
					: process.env.INVITE_SUPER_ADMIN_TOKEN_KEY;

		const hmacRes = await this.crypt
			.hashWithHmac({ data: email.value, key: key as string })
			.catch(() => {
				throw new UnauthorizedException();
			});
		return hmacRes === code;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();

		const regex = /invite=([^&]+)/gm;
		const invite = regex.exec(req?._parsedUrl?.query ?? '') as string[];
		const email = new Email(req?.body?.email);

		const otp = await this.otpRepo.find({ email });
		if (!otp) throw new UnauthorizedException();

		const validationRes = await this.validate(
			email,
			invite instanceof Array && invite.length >= 2 ? invite[1] : '',
			otp.requiredLevel,
		);
		if (!validationRes) throw new UnauthorizedException();

		req.inMemoryData = otp;

		return true;
	}
}
