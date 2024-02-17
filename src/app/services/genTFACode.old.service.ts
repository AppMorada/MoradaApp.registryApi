import { Email, UUID } from '@app/entities/VO';
import { Injectable } from '@nestjs/common';
import { CryptAdapter } from '@app/adapters/crypt';
import { EmailAdapter } from '@app/adapters/email';
import { OTPRepo } from '@app/repositories/otp';
import { OTP } from '@app/entities/OTP';
import { IService } from './_IService';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';

interface IProps {
	email: Email;
	userId: UUID;
	ttl?: number;
}

@Injectable()
export class GenOldTFASevice implements IService {
	constructor(
		private readonly email: EmailAdapter,
		private readonly otp: OTPRepo,
		private readonly crypt: CryptAdapter,
		private readonly getEnv: GetEnvService,
	) {}

	private async generateRandomNumbers() {
		let rawCode: number[] | string = [];

		for (let i = 0; i <= 5; i++)
			rawCode.push(Math.floor(Math.random() * 9));

		rawCode = rawCode.join().replaceAll(',', '');

		const hash = await this.crypt.hash(rawCode);
		const code = String(hash);

		return { rawCode, code };
	}

	async exec(input: IProps) {
		const { rawCode, code } = await this.generateRandomNumbers();
		const otp = new OTP({
			code,
			userId: input.userId.value,
			ttl: input.ttl ?? 1000 * 60 * 2,
		});

		await this.otp.create({
			email: input.email,
			otp,
		});

		const { env: NAME_SENDER } = await this.getEnv.exec({
			env: EnvEnum.NAME_SENDER,
		});
		const { env: EMAIL_SENDER } = await this.getEnv.exec({
			env: EnvEnum.EMAIL_SENDER,
		});
		const { env: PROJECT_NAME } = await this.getEnv.exec({
			env: EnvEnum.PROJECT_NAME,
		});

		await this.email.send({
			from: `${NAME_SENDER} <${EMAIL_SENDER}>`,
			to: input.email.value,
			subject: `${PROJECT_NAME} - Solicitação de login`,
			body: `<h1>Seja bem-vindo!</h1>
				<p>Não compartilhe este código com ninguém</p>
				<p>${rawCode}</p>`,
		});
	}
}
