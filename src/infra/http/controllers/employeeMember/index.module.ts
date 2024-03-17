import { UpdateEnterpriseMemberController } from './update.flow/update.controller';
import { RemoveEntepriseMemberController } from './delete.flow/delete.controller';
import { GetEnterpriseMemberController } from './get.flow/get.controller';
import { CreateEnterpriseMemberController } from './createEnterpriseMember.flow/create.controller';
import { Module } from '@nestjs/common';
import { RemoveEmployeeMemberService } from '@app/services/members/employee/removeMember.service';
import { UpdateEmployeeMemberService } from '@app/services/members/employee/updateMember.service';
import { GetEmployeeMemberByUserIdService } from '@app/services/members/employee/getByUserId.service';
import { GetEmployeeMemberGroupByCondominiumIdService } from '@app/services/members/employee/getByGroupByCondominiumId.service';
import { CreateEmployeeUserService } from '@app/services/members/employee/create.service';

@Module({
	controllers: [
		UpdateEnterpriseMemberController,
		RemoveEntepriseMemberController,
		GetEnterpriseMemberController,
		CreateEnterpriseMemberController,
	],
	providers: [
		UpdateEmployeeMemberService,
		RemoveEmployeeMemberService,
		GetEmployeeMemberByUserIdService,
		GetEmployeeMemberGroupByCondominiumIdService,
		CreateEmployeeUserService,
	],
})
export class EmployeeMemberModule {}
