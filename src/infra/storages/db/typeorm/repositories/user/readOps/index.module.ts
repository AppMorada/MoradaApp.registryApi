import { UserReadOps } from '@app/repositories/user/read';
import { Global, Module } from '@nestjs/common';
import { TypeOrmUserRead } from './userReadOps.service';

@Global()
@Module({
	providers: [
		{
			provide: UserReadOps.Read,
			useClass: TypeOrmUserRead,
		},
	],
	exports: [UserReadOps.Read],
})
export class TypeOrmUserReadOpsModule {}
