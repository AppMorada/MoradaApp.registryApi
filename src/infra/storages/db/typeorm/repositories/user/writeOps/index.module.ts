import { UserWriteOps } from '@app/repositories/user/write';
import { Global, Module } from '@nestjs/common';
import { TypeOrmUserCreate } from './userCreate.service';
import { TypeOrmUserDelete } from './userDelete.service';
import { TypeOrmUserUpdate } from './userUpdate.service';

@Global()
@Module({
	providers: [
		{
			provide: UserWriteOps.Create,
			useClass: TypeOrmUserCreate,
		},
		{
			provide: UserWriteOps.Delete,
			useClass: TypeOrmUserDelete,
		},
		{
			provide: UserWriteOps.Update,
			useClass: TypeOrmUserUpdate,
		},
	],
	exports: [UserWriteOps.Create, UserWriteOps.Delete, UserWriteOps.Update],
})
export class TypeOrmUserWriteOpsModule {}
