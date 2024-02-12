import { CryptAdapter } from '@app/adapters/crypt';
import { Email } from '@app/entities/VO';
import { GuardErrors } from '@app/errors/guard';
import { UserRepo } from '@app/repositories/user';
import { FinishLoginWithTFADTO } from '@infra/http/DTO/finishLoginWithTFA.DTO';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { checkClassValidatorErrors } from '@utils/convertValidatorErr';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { generateStringCodeContent } from '@utils/generateStringCodeContent';
import { User } from '@app/entities/user';

/** Usado para validar o códigos gerados nos fluxos de autenticação de dois fatores */
@Injectable()
export class CheckTFACodeGuard implements CanActivate {
	constructor(
		private readonly userRepo: UserRepo,
		private readonly crypt: CryptAdapter,
	) {}

	private async validate(user: User, codeUsedOnInput: string) {
		const metadata = codeUsedOnInput.split('.')[0];
		const code = generateStringCodeContent({
			email: user.email,
			id: user.id,
		});

		const signature = await this.crypt.hashWithHmac({
			data: `${metadata}.${btoa(code)}`,
			key: process.env.TFA_TOKEN_KEY as string,
		});
		const codeForValidation = `${metadata}.${btoa(signature)}`;

		const parsedMetadata = JSON.parse(atob(metadata));
		return (
			codeForValidation === codeUsedOnInput &&
			parsedMetadata?.exp >= Date.now()
		);
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		const token = String(req?.headers?.authorization).split(' ')[1];
		if (!token) throw new GuardErrors({ message: 'O código é inválido' });

		const body = plainToClass(FinishLoginWithTFADTO, req.body);
		await checkClassValidatorErrors({ body });

		const user = await this.userRepo
			.find({
				key: new Email(body.email),
				safeSearch: true,
			})
			.catch(() => {
				throw new GuardErrors({
					message: 'Usuário não existe',
				});
			});
		const validationRes = await this.validate(user, token);
		if (!validationRes)
			throw new GuardErrors({
				message: 'O código é inválido',
			});

		req.inMemoryData = { ...req.inMemoryData, user };
		return true;
	}
}
