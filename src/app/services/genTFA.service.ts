import { CryptAdapter } from '@app/adapters/crypt';
import { EmailAdapter } from '@app/adapters/email';
import { OTP } from '@app/entities/OTP';
import { Code } from '@app/entities/VO/code';
import { Email } from '@app/entities/VO/email';
import { OTPRepo } from '@app/repositories/otp';
import { Injectable } from '@nestjs/common';

interface IProps {
	email: Email;
	userId: string;
	condominiumId: string;
}

@Injectable()
export class GenTFAService {
	constructor(
		private readonly email: EmailAdapter,
		private readonly otp: OTPRepo,
		private readonly crypt: CryptAdapter,
	) {}

	private async generateRandomNumbers() {
		let rawCode: number[] | string = [];

		for (let i = 0; i <= 5; i++)
			rawCode.push(Math.floor(Math.random() * 9));

		rawCode = rawCode.join().replaceAll(',', '');

		const hash = await this.crypt.hash(rawCode);
		const code = new Code(String(hash));

		return { rawCode, code };
	}

	async exec(input: IProps) {
		const { rawCode, code } = await this.generateRandomNumbers();
		const otp = new OTP({
			code,
			userId: input.userId,
			condominiumId: input.condominiumId,
		});

		this.otp.create({
			email: input.email,
			otp,
		});

		await this.email.send({
			from: `${process.env.NAME_SENDER} <${process.env.EMAIL_SENDER}>`,
			to: input.email.value,
			subject: `${process.env.PROJECT_NAME} - Solicitação de login`,
			body: `<h1>Seja bem-vindo!</h1>
				<p>Não compartilhe este código com ninguém</p>
				<p>${rawCode}</p>`,
		});
	}
}
