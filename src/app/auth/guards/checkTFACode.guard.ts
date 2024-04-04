import { Email } from '@app/entities/VO';
import { GuardErrors } from '@app/errors/guard';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { KeysEnum } from '@app/repositories/key';
import { ValidateTFAService } from '@app/services/login/validateTFA.service';
import { UserRepoReadOps } from '@app/repositories/user/read';
import { Reflector } from '@nestjs/core';
import { guardMetadataValues } from './_metadata';

@Injectable()
export class CheckTFACodeGuard implements CanActivate {
	constructor(
		private readonly userRepo: UserRepoReadOps,
		private readonly validateTFA: ValidateTFAService,
		private readonly reflector: Reflector,
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

		const userContent = await this.userRepo
			.find({
				key: new Email(decodedData.sub),
				safeSearch: true,
			})
			.catch((err) => {
				throw new GuardErrors({
					message: err.message,
				});
			});

		const keyName = this.reflector.get<KeysEnum | undefined>(
			guardMetadataValues.checkTFACodeGuard.keyName,
			context.getHandler(),
		);
		await this.validateTFA.exec({
			user: userContent.user,
			uniqueRegistry: userContent.uniqueRegistry,
			code: token,
			name: keyName ?? KeysEnum.TFA_TOKEN_KEY,
		});

		req.inMemoryData = {
			...req.inMemoryData,
			user: userContent.user,
			uniqueRegistry: userContent.uniqueRegistry,
		};
		return true;
	}
}
