import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../../../consts';
import { Repository } from 'typeorm';
import {
	CommunityMemberWriteOps,
	CommunityMemberRepoWriteOpsInterfaces,
} from '@app/repositories/communityMember/write';
import { TypeOrmCommunityInfosEntity } from '../../../entities/communityInfos.entity';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmCommunityMemberUpdate
implements CommunityMemberWriteOps.Update
{
	constructor(
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
		@Inject(typeORMConsts.entity.communityInfos)
		private readonly communityInfosRepo: Repository<TypeOrmCommunityInfosEntity>,
	) {}

	async exec(
		input: CommunityMemberRepoWriteOpsInterfaces.update,
	): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Update community member');

		const modifications = {
			block: input.block?.value,
			apartmentNumber: input.apartmentNumber?.value,
		};

		for (const rawKey in modifications) {
			const key = rawKey as keyof typeof modifications;
			if (!modifications[key]) delete modifications[key];
		}

		if (modifications.block || modifications.apartmentNumber)
			await this.communityInfosRepo.update(
				{ member: input.id.value },
				modifications,
			);

		span.end();
	}
}
