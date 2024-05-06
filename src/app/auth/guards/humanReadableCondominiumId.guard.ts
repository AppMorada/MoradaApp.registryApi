import { CondominiumReadOps } from '@app/repositories/condominium/read';
import { CreateCondominiumMemberUserDTO } from '@infra/http/DTO/user/createCondominiumMemberUser.DTO';
import { CanActivate, Injectable } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { checkClassValidatorErrors } from '@utils/convertValidatorErr';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';

@Injectable()
export class HumanReadableCondominiumIdGuard implements CanActivate {
	constructor(
		private readonly readCondominiumRepo: CondominiumReadOps.GetByHumanReadableId,
	) {}

	async canActivate(context: ExecutionContextHost): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		const body = plainToClass(CreateCondominiumMemberUserDTO, req.body);
		await checkClassValidatorErrors({ body });

		const condominium = await this.readCondominiumRepo.exec({
			id: body.condominiumHumanReadableId,
			safeSearch: true,
		});

		req.inMemoryData = {
			...req.inMemoryData,
			condominium,
		};

		return true;
	}
}
