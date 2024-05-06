import { CondominiumRequestWriteOps } from '@app/repositories/condominiumRequest/write';
import { Global, Module } from '@nestjs/common';
import { TypeOrmCondominiumRequestAcceptRequest } from './acceptRequest.service';
import { TypeOrmCondominiumRequestCreate } from './create.service';
import { TypeOrmCondominiumRequestRemove } from './removeByUserIdAndCondominiumId.service';

@Global()
@Module({
	providers: [
		{
			provide: CondominiumRequestWriteOps.AcceptRequest,
			useClass: TypeOrmCondominiumRequestAcceptRequest,
		},
		{
			provide: CondominiumRequestWriteOps.Create,
			useClass: TypeOrmCondominiumRequestCreate,
		},
		{
			provide: CondominiumRequestWriteOps.RemoveByUserIdAndCondominiumId,
			useClass: TypeOrmCondominiumRequestRemove,
		},
	],
	exports: [
		CondominiumRequestWriteOps.RemoveByUserIdAndCondominiumId,
		CondominiumRequestWriteOps.Create,
		CondominiumRequestWriteOps.AcceptRequest,
	],
})
export class TypeOrmCondominiumRequestWriteOpsModule {}
