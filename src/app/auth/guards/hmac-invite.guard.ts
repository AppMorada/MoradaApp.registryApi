import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { CryptAdapter } from '@app/adapters/crypt';
import { OTPRepo } from '@app/repositories/otp';
import { Email } from '@app/entities/VO/email';

@Injectable()
export class HmacInviteGuard implements CanActivate {
	constructor(
		private readonly crypt: CryptAdapter,
		private readonly otpRepo: OTPRepo,
	) {}

	private async validate(email: Email, code: string) {
		const hmacRes = await this.crypt
			.hashWithHmac({
				data: email.value,
				key: process.env.INVITE_TOKEN_KEY as string,
			})
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

		const validationRes = await this.validate(
			email,
			invite instanceof Array && invite.length >= 2 ? invite[1] : '',
		);
		if (!validationRes) throw new UnauthorizedException();

		const otp = await this.otpRepo.find({ email });
		if (!otp) throw new UnauthorizedException();

		req.inMemoryData = otp;

		return true;
	}
}
