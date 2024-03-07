import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GuardErrors } from '@app/errors/guard';
import { Request } from 'express';
import { CPF, Email } from '@app/entities/VO';
import { CryptAdapter } from '@app/adapters/crypt';
import { InviteRepo } from '@app/repositories/invite';
import { checkClassValidatorErrors } from '@utils/convertValidatorErr';
import { CreateUserDTO } from '@infra/http/DTO/user/create.DTO';
import { plainToClass } from 'class-transformer';
import { Invite } from '@app/entities/invite';

@Injectable()
export class InviteGuard implements CanActivate {
	constructor(
		private readonly inviteRepo: InviteRepo,
		private readonly cryptAdapter: CryptAdapter,
	) {}

	private async getInvites(recipient: Email) {
		const invites = await this.inviteRepo
			.find({ key: recipient, safeSearch: true })
			.catch((err) => {
				throw new GuardErrors({ message: err.message });
			});

		return invites;
	}

	private async checkCode(invites: Invite[], code: string, cpf: CPF) {
		let invite: Invite | undefined;
		for (let i = 0; i < invites.length; i++) {
			const res = await this.cryptAdapter.compare({
				data: `${cpf.value}-${code}`,
				hashedData: invites[i].code,
			});
			if (res) {
				invite = invites[i];
				break;
			}

			if (!res && i === invites.length - 1)
				throw new GuardErrors({ message: 'Código inválido' });
		}

		return invite;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();
		const body = plainToClass(CreateUserDTO, req.body);
		await checkClassValidatorErrors({ body });

		const invites = await this.getInvites(new Email(body.email));
		const invite = await this.checkCode(
			invites,
			body.code,
			new CPF(body.CPF),
		);

		req.inMemoryData = {
			...req.inMemoryData,
			invite,
		};

		return true;
	}
}
