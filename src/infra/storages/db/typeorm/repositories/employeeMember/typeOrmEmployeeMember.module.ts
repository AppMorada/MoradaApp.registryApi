import { Global, Module } from '@nestjs/common';
import { TypeOrmEmployeeMemberWriteOpsModule } from './writeOps/index.module';
import { TypeOrmEmployeeMemberReadOpsModule } from './readOps/index.module';

@Global()
@Module({
	imports: [
		TypeOrmEmployeeMemberWriteOpsModule,
		TypeOrmEmployeeMemberReadOpsModule,
	],
	exports: [
		TypeOrmEmployeeMemberWriteOpsModule,
		TypeOrmEmployeeMemberReadOpsModule,
	],
})
export class TypeOrmEmployeeMemberModule {}
