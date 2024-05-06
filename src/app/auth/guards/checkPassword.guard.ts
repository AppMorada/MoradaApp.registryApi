import { CryptAdapter } from '@app/adapters/crypt';
import { Email, Password } from '@app/entities/VO';
import { GuardErrors } from '@app/errors/guard';
import { UserReadOps } from '@app/repositories/user/read';
import { StartLoginDTO } from '@infra/http/DTO/login/login.DTO';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { checkClassValidatorErrors } from '@utils/convertValidatorErr';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';

@Injectable()
export class CheckPasswordGuard implements CanActivate {
	constructor(
		private readonly crypt: CryptAdapter,
		private readonly readUserRepo: UserReadOps.Read,
	) {}

	private async validate(password: Password, hash: string) {
		const response = await this.crypt.compare({
			data: password.value,
			hashedData: hash,
		});

		if (!response)
			throw new GuardErrors({
				message: 'Email ou senha incorretos',
			});
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		const body = plainToClass(StartLoginDTO, req.body);
		await checkClassValidatorErrors({ body });

		const email = new Email(body.email);
		const password = new Password(body.password);

		const userContent = await this.readUserRepo
			.exec({ key: email, safeSearch: true })
			.catch((err) => {
				throw new GuardErrors({
					message: err.message,
				});
			});
		await this.validate(password, userContent.user.password.value);

		req.inMemoryData = {
			...req.inMemoryData,
			user: userContent.user,
			uniqueRegistry: userContent.uniqueRegistry,
		};

		return true;
	}
}
