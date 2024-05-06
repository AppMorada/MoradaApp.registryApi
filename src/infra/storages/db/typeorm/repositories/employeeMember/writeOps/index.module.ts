import { EmployeeMemberWriteOps } from '@app/repositories/employeeMember/write';
import { Global, Module } from '@nestjs/common';
import { TypeOrmEmployeeMemberCreate } from './create.service';
import { TypeOrmEmployeeMemberRemove } from './remove.service';
import { TypeOrmEmployeeMemberUpdate } from './update.service';

@Global()
@Module({
	providers: [
		{
			provide: EmployeeMemberWriteOps.Create,
			useClass: TypeOrmEmployeeMemberCreate,
		},
		{
			provide: EmployeeMemberWriteOps.Remove,
			useClass: TypeOrmEmployeeMemberRemove,
		},
		{
			provide: EmployeeMemberWriteOps.Update,
			useClass: TypeOrmEmployeeMemberUpdate,
		},
	],
	exports: [
		EmployeeMemberWriteOps.Update,
		EmployeeMemberWriteOps.Remove,
		EmployeeMemberWriteOps.Create,
	],
})
export class TypeOrmEmployeeMemberWriteOpsModule {}
