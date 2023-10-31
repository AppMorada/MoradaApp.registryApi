import { CryptAdapter } from '@app/adapters/crypt';
import { EmailAdapter } from '@app/adapters/email';
import { OTP } from '@app/entities/OTP';
import { Code } from '@app/entities/VO/code';
import { Email } from '@app/entities/VO/email';
import { Level } from '@app/entities/VO/level';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { OTPRepo } from '@app/repositories/otp';
import { UserRepo } from '@app/repositories/user';
import { Injectable } from '@nestjs/common';
import {
	IGenerateInviteKeyProps,
	generateInviteInput,
} from '@utils/generateInviteData';
import { randomUUID } from 'crypto';

interface IProps {
	email: Email;
	condominiumId: string;
	requiredLevel?: Level;
	key?: string;
}

@Injectable()
export class GenInviteService {
	constructor(
		private readonly cryptAdapter: CryptAdapter,
		private readonly emailAdapter: EmailAdapter,
		private readonly userRepo: UserRepo,
		private readonly otpRepo: OTPRepo,
	) {}

	private async generateCodeForOTP(
		input: Omit<IGenerateInviteKeyProps, 'otpId'>,
		key: string,
	) {
		const otpId = randomUUID();

		const inputData = generateInviteInput({
			condominiumId: input.condominiumId,
			requiredLevel: input.requiredLevel,
			otpId,
			email: input.email,
		});

		const hmacRes = await this.cryptAdapter.hashWithHmac({
			key,
			data: inputData,
		});
		const representationalHash = await this.cryptAdapter.hash(hmacRes);

		const otp = new OTP(
			{
				code: new Code(representationalHash),
				condominiumId: input.condominiumId,
				requiredLevel: input.requiredLevel,
				ttl: 1000 * 60 * 60 * 24 * 3,
			},
			otpId,
		);

		return {
			notSafeHash: hmacRes,
			otp,
		};
	}

	async exec(input: IProps) {
		const user = await this.userRepo.find({ email: input.email });
		if (user)
			throw new ServiceErrors({
				message: 'O usuário já existe',
				tag: ServiceErrorsTags.alreadyExist,
			});

		const { otp, notSafeHash } = await this.generateCodeForOTP(
			{
				requiredLevel: input.requiredLevel,
				condominiumId: input.condominiumId,
				email: input.email,
			},
			input.key ?? (process.env.INVITE_TOKEN_KEY as string),
		);

		await this.otpRepo.create({ otp, email: input.email });

		await this.emailAdapter.send({
			from: `${process.env.NAME_SENDER} <${process.env.EMAIL_SENDER}>`,
			to: input.email.value,
			subject: `${process.env.PROJECT_NAME} - Convite para o condomínio`,
			body: `<h1>Seja bem-vindo!</h1>
				<p>Não compartilhe este link com ninguém</p>
				<a href="#">https://[EXEMPLO DE DOMÍNIO]/[PÁGINA DO FRONT PARA VALIDAR O CONVITE]/${notSafeHash}</a>`,
		});

		return otp;
	}
}
