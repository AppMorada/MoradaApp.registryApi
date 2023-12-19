import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CryptAdapter } from '@registry:app/adapters/crypt';
import { OTPRepo } from '@registry:app/repositories/otp';
import { Email } from '@registry:app/entities/VO/email';
import { OTP } from '@registry:app/entities/OTP';
import { generateInviteInput } from '@registry:utils/generateInviteData';
import { GuardErrors } from '@registry:app/errors/guard';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import { InviteUserDTO } from '@registry:infra/http/DTO/inviteUser.DTO';
import { checkClassValidatorErrors } from '@registry:utils/convertValidatorErr';

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

		const body = plainToClass(InviteUserDTO, req.body);
		await checkClassValidatorErrors({ body });
		const email = new Email(body.email);

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
