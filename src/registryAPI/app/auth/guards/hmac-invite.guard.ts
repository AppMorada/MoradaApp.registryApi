import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CryptAdapter } from '@registry:app/adapters/crypt';
import { Email } from '@registry:app/entities/VO';
import { generateStringCodeContent } from '@registry:utils/generateStringCodeContent';
import { GuardErrors } from '@registry:app/errors/guard';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import { InviteUserDTO } from '@registry:infra/http/DTO/inviteUser.DTO';
import { checkClassValidatorErrors } from '@registry:utils/convertValidatorErr';
import { InviteRepo } from '@registry:app/repositories/invite';
import { Invite } from '@registry:app/entities/invite';

interface IValidate {
	email: Email;
	inviteAsHash: string;
	invite: Invite;
}

/** Usado para validar a integridade e validade dos convites */
@Injectable()
export class HmacInviteGuard implements CanActivate {
	constructor(
		private readonly crypt: CryptAdapter,
		private readonly inviteRepo: InviteRepo,
	) {}

	private mapKeyBasedOnLevel(input: number | undefined) {
		switch (input) {
		case 1:
			return process.env.INVITE_ADMIN_TOKEN_KEY;
		case 2:
			return process.env.INVITE_SUPER_ADMIN_TOKEN_KEY;
		default:
			return process.env.INVITE_TOKEN_KEY;
		}
	}

	private async validate(input: IValidate): Promise<boolean> {
		const key = this.mapKeyBasedOnLevel(input.invite.type.value);

		const invite = generateStringCodeContent({
			condominiumId: input.invite.condominiumId,
			email: input.email,
			requiredLevel: input.invite.type,
			id: input.invite.id,
		});
		const hashedInvite = await this.crypt
			.hashWithHmac({ data: invite, key: key as string })
			.catch(() => {
				throw new GuardErrors({
					message: 'Falha ao tentar gerar um HMAC do convite',
				});
			});

		return hashedInvite === input.inviteAsHash;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		const body = plainToClass(InviteUserDTO, req.body);
		await checkClassValidatorErrors({ body });
		const email = new Email(body.email);

		if (typeof req.query?.invite !== 'string')
			throw new GuardErrors({
				message: 'O convite é inválido',
			});

		const invite = await this.inviteRepo.find({
			key: email,
			safeSearch: true,
		});

		const inviteAsHash = req.query.invite;
		const validationRes = await this.validate({
			email,
			inviteAsHash,
			invite,
		});
		if (!validationRes || invite.expiresAt.getTime() < Date.now())
			throw new GuardErrors({
				message: 'O convite é inválido',
			});

		req.inMemoryData = { ...req.inMemoryData, invite };

		return true;
	}
}
