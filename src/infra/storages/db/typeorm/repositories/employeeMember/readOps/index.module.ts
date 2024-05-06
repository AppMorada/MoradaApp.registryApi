import { EmployeeMemberReadOps } from '@app/repositories/employeeMember/read';
import { Global, Module } from '@nestjs/common';
import { TypeOrmEmployeeMemberGetByUserId } from './getByUserId.service';
import { TypeOrmEmployeeMemberGetGroupByCondominiumId } from './getGroupCondominiumId.service';

@Global()
@Module({
	providers: [
		{
			provide: EmployeeMemberReadOps.GetByUserId,
			useClass: TypeOrmEmployeeMemberGetByUserId,
		},
		{
			provide: EmployeeMemberReadOps.GetGroupByCondominiumId,
			useClass: TypeOrmEmployeeMemberGetGroupByCondominiumId,
		},
	],
	exports: [
		EmployeeMemberReadOps.GetGroupByCondominiumId,
		EmployeeMemberReadOps.GetByUserId,
	],
})
export class TypeOrmEmployeeMemberReadOpsModule {}
