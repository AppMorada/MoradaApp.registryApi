import { CryptAdapter } from '@registry:app/adapters/crypt';
import { Email } from '@registry:app/entities/VO/email';
import { Password } from '@registry:app/entities/VO/password';
import { GuardErrors } from '@registry:app/errors/guard';
import { UserRepo } from '@registry:app/repositories/user';
import { LoginDTO } from '@registry:infra/http/DTO/login.DTO';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { checkClassValidatorErrors } from '@registry:utils/convertValidatorErr';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';

@Injectable()
export class CheckPasswordGuard implements CanActivate {
	constructor(
		private readonly crypt: CryptAdapter,
		private readonly userRepo: UserRepo,
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

		const body = plainToClass(LoginDTO, req.body);
		await checkClassValidatorErrors({ body });

		const email = new Email(body.email);
		const password = new Password(body.password);

		const user = await this.userRepo.find({ email });
		if (!user)
			throw new GuardErrors({
				message: 'Usuário não existe',
			});

		await this.validate(password, user.password.value);

		req.inMemoryData = {
			...req.inMemoryData,
			user,
		};

		return true;
	}
}
