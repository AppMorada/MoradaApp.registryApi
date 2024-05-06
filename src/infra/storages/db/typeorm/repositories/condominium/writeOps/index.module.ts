import { Global, Module } from '@nestjs/common';
import { TypeOrmCondominiumCreate } from './condominiumCreate.service';
import { CondominiumWriteOps } from '@app/repositories/condominium/write';
import { TypeOrmCondominiumDelete } from './condominiumDelete.service';
import { TypeOrmCondominiumUpdate } from './condominiumUpdate.service';

@Global()
@Module({
	providers: [
		{
			provide: CondominiumWriteOps.Create,
			useClass: TypeOrmCondominiumCreate,
		},
		{
			provide: CondominiumWriteOps.Remove,
			useClass: TypeOrmCondominiumDelete,
		},
		{
			provide: CondominiumWriteOps.Update,
			useClass: TypeOrmCondominiumUpdate,
		},
	],
	exports: [
		CondominiumWriteOps.Create,
		CondominiumWriteOps.Remove,
		CondominiumWriteOps.Update,
	],
})
export class TypeOrmCondominiumWriteOpsModule {}
