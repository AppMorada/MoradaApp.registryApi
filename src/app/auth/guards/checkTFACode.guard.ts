import { Email } from '@app/entities/VO';
import { GuardErrors } from '@app/errors/guard';
import { UserRepo } from '@app/repositories/user';
import { FinishLoginWithTFADTO } from '@infra/http/DTO/finishLoginWithTFA.DTO';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { checkClassValidatorErrors } from '@utils/convertValidatorErr';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { KeysEnum } from '@app/repositories/key';
import { ValidateTFAService } from '@app/services/validateTFA.service';

/** Usado para validar o códigos gerados nos fluxos de autenticação de dois fatores */
@Injectable()
export class CheckTFACodeGuard implements CanActivate {
	constructor(
		private readonly userRepo: UserRepo,
		private readonly validateTFA: ValidateTFAService,
	) {}

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

		await this.validateTFA.exec({
			user,
			code: token,
			name: KeysEnum.TFA_TOKEN_KEY,
		});

		req.inMemoryData = { ...req.inMemoryData, user };
		return true;
	}
}
