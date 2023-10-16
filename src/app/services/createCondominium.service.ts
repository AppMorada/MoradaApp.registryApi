import { EmailAdapter } from '@app/adapters/email';
import { TokenType } from '@app/auth/tokenTypes';
import { Email } from '@app/entities/VO/email';
import { Condominium } from '@app/entities/condominium';
import { CondominiumRepo } from '@app/repositories/condominium';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface IProps {
	condominium: Condominium;
	email: Email;
}

@Injectable()
export class CreateCondominiumService {
	constructor(
		private readonly condominiumRepo: CondominiumRepo,
		private readonly tokenService: JwtService,
		private readonly mailAdapter: EmailAdapter,
	) {}

	async exec(input: IProps) {
		await this.condominiumRepo.create({
			condominium: input.condominium,
		});
		const token = await this.tokenService.signAsync(
			{
				sub: input.condominium.id,
				type: TokenType.createCondominium,
			},
			{
				secret: process.env.CONDOMINIUM_TOKEN_KEY as string,
				expiresIn: 1000 * 60 * 60 * 48,
			},
		);

		await this.mailAdapter.send({
			from: `${process.env.NAME_SENDER} <${process.env.EMAIL_SENDER}>`,
			to: input.email.value(),
			subject: `${process.env.PROJECT_NAME} - Criação de condomínio`,
			body: `<h1>Seja bem-vindo!</h1>
				<p>Não compartilhe este link com ninguém</p>
				<a href="#">${token}</a>`,
		});

		return { token };
	}
}
