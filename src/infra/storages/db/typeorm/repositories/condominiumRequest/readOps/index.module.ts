import { CondominiumRequestReadOps } from '@app/repositories/condominiumRequest/read';
import { Global, Module } from '@nestjs/common';
import { TypeOrmCondominiumRequestFindByCondominiumId } from './findByCondominiumId.service';
import { TypeOrmCondominiumRequestFindByUserId } from './findByUserId.service';

@Global()
@Module({
	providers: [
		{
			provide: CondominiumRequestReadOps.FindByCondominiumId,
			useClass: TypeOrmCondominiumRequestFindByCondominiumId,
		},
		{
			provide: CondominiumRequestReadOps.FindByUserId,
			useClass: TypeOrmCondominiumRequestFindByUserId,
		},
	],
	exports: [
		CondominiumRequestReadOps.FindByCondominiumId,
		CondominiumRequestReadOps.FindByUserId,
	],
})
export class TypeOrmCondominiumRequestReadOpsModule {}
