import { Email } from '@app/entities/VO';
import { GuardErrors } from '@app/errors/guard';
import { UserRepo } from '@app/repositories/user';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { KeysEnum } from '@app/repositories/key';
import { ValidateTFAService } from '@app/services/login/validateTFA.service';

@Injectable()
export class CheckTFACodeGuard implements CanActivate {
	constructor(
		private readonly userRepo: UserRepo,
		private readonly validateTFA: ValidateTFAService,
	) {}

	private parseToken(token: string) {
		const sections = token.split('.');
		if (sections.length !== 2)
			throw new GuardErrors({
				message: 'Código de dois fatores malformado',
			});

		let decodedMetadata: any;
		try {
			decodedMetadata = JSON.parse(decodeURIComponent(atob(sections[0])));
		} catch (err) {
			throw new GuardErrors({
				message: 'Código de dois fatores malformado',
			});
		}

		return decodedMetadata;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		const token = String(req?.headers?.authorization).split(' ')[1];
		if (!token) throw new GuardErrors({ message: 'O código é inválido' });

		const decodedData = this.parseToken(token);
		if (!decodedData?.sub)
			throw new GuardErrors({
				message: 'Código de dois fatores não contém o campo "sub"',
			});

		const user = await this.userRepo
			.find({
				key: new Email(decodedData.sub),
				safeSearch: true,
			})
			.catch((err) => {
				throw new GuardErrors({
					message: err.message,
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
