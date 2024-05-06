import { CondominiumReadOps } from '@app/repositories/condominium/read';
import { Global, Module } from '@nestjs/common';
import { TypeOrmCondominiumGetByHumanReadableId } from './GetByHumanReadableId.service';
import { TypeOrmCondominiumGetByOwnerId } from './getByOwnerId.service';
import { TypeOrmCondominiumSearch } from './search.service';

@Global()
@Module({
	providers: [
		{
			provide: CondominiumReadOps.GetByHumanReadableId,
			useClass: TypeOrmCondominiumGetByHumanReadableId,
		},
		{
			provide: CondominiumReadOps.GetByOwnerId,
			useClass: TypeOrmCondominiumGetByOwnerId,
		},
		{
			provide: CondominiumReadOps.Search,
			useClass: TypeOrmCondominiumSearch,
		},
	],
	exports: [
		CondominiumReadOps.GetByHumanReadableId,
		CondominiumReadOps.GetByOwnerId,
		CondominiumReadOps.Search,
	],
})
export class TypeOrmCondominiumReadOpsModule {}
