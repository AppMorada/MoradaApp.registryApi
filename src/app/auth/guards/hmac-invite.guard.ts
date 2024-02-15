import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CryptAdapter } from '@app/adapters/crypt';
import { Email } from '@app/entities/VO';
import { generateStringCodeContent } from '@utils/generateStringCodeContent';
import { GuardErrors } from '@app/errors/guard';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import { InviteUserDTO } from '@infra/http/DTO/inviteUser.DTO';
import { checkClassValidatorErrors } from '@utils/convertValidatorErr';
import { InviteRepo } from '@app/repositories/invite';
import { Invite } from '@app/entities/invite';
import { mapInviteKeyBasedOnLevel } from '@utils/mapInviteKeyBasedOnLevel';
import { GetKeyService } from '@app/services/getKey.service';

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
		private readonly getKey: GetKeyService,
	) {}

	private async validate(input: IValidate): Promise<boolean> {
		const key = await mapInviteKeyBasedOnLevel(
			input.invite.type.value,
			this.getKey,
		);

		const invite = generateStringCodeContent({
			condominiumId: input.invite.condominiumId,
			email: input.email,
			requiredLevel: input.invite.type,
			id: input.invite.id,
		});
		const hashedInvite = await this.crypt
			.hashWithHmac({ data: invite, key })
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
