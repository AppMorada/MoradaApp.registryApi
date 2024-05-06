import {
	UserRepoWriteOpsInterfaces,
	UserWriteOps,
} from '@app/repositories/user/write';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmUserEntity } from '../../../entities/user.entity';
import { typeORMConsts } from '../../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmUserUpdate implements UserWriteOps.Update {
	constructor(
		@Inject(typeORMConsts.entity.user)
		private readonly userRepo: Repository<TypeOrmUserEntity>,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(input: UserRepoWriteOpsInterfaces.update): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Update user');

		const modifications = {
			name: input.name?.value,
			phoneNumber: input.phoneNumber?.value,
			password: input.password?.value,
		};

		for (const rawKey in modifications) {
			const key = rawKey as keyof typeof modifications;
			if (!modifications[key]) delete modifications[key];
		}

		await this.userRepo.update({ id: input.id.value }, modifications);
		span.end();
	}
}
