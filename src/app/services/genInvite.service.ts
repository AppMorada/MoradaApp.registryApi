import { CryptAdapter } from '@app/adapters/crypt';
import { EmailAdapter } from '@app/adapters/email';
import { OTP } from '@app/entities/OTP';
import { Code } from '@app/entities/VO/code';
import { Email } from '@app/entities/VO/email';
import { OTPRepo } from '@app/repositories/otp';
import { Injectable } from '@nestjs/common';

interface IProps {
	email: Email;
	condominiumId: string;
}

@Injectable()
export class GenInviteService {
	constructor(
		private readonly cryptAdapter: CryptAdapter,
		private readonly emailAdapter: EmailAdapter,
		private readonly otpRepo: OTPRepo,
	) {}

	async exec(input: IProps) {
		const hmacRes = await this.cryptAdapter.hashWithHmac({
			key: process.env.INVITE_TOKEN_KEY as string,
			data: input.email.value,
		});

		const otp = new OTP({
			code: new Code(hmacRes),
			condominiumId: input.condominiumId,
			ttl: 1000 * 60 * 60 * 24 * 3,
		});
		await this.otpRepo.create({ otp, email: input.email });

		await this.emailAdapter.send({
			from: `${process.env.NAME_SENDER} <${process.env.EMAIL_SENDER}>`,
			to: input.email.value,
			subject: `${process.env.PROJECT_NAME} - Criação de condomínio`,
			body: `<h1>Seja bem-vindo!</h1>
				<p>Não compartilhe este link com ninguém</p>
				<a href="#">${otp.code.value}</a>`,
		});

		return otp;
	}
}
