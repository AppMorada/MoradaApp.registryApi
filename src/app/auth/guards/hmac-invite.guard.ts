import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CryptAdapter } from '@app/adapters/crypt';
import { OTPRepo } from '@app/repositories/otp';
import { Email } from '@app/entities/VO/email';
import { OTP } from '@app/entities/OTP';
import { generateInviteInput } from '@utils/generateInviteData';
import { GuardErrors } from '@app/errors/guard';
import { Request } from 'express';

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
				throw new GuardErrors({
					message: 'Falha ao tentar gerar um HMAC do convite',
				});
			});

		const hmacValidation = hmacRes === input.code;
		const cryptValidation = await this.crypt.compare({
			data: input.code,
			hashedData: input.otp.code.value,
		});

		return hmacValidation && cryptValidation;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		const email = req?.body?.email ? new Email(req.body.email) : undefined;
		if (!email)
			throw new GuardErrors({
				message: 'Email não inserido no body da requisição',
			});

		const otp = await this.otpRepo.find({ email });
		if (!otp) throw new GuardErrors({ message: 'O convite não existe' });

		const validationRes = await this.validate({
			email,
			code: String(req.query.invite),
			otp,
		});
		if (!validationRes)
			throw new GuardErrors({
				message: 'O convite é inválido',
			});

		req.inMemoryData = {
			...req.inMemoryData,
			otp,
		};

		return true;
	}
}
