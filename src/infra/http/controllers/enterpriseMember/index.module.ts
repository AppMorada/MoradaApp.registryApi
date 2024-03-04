import { UpdateEnterpriseMemberService } from '@app/services/members/enterprise/updateMember.service';
import { UpdateEnterpriseMemberController } from './update.flow/update.controller';
import { RemoveEntepriseMemberController } from './delete.flow/delete.controller';
import { GetEnterpriseMemberController } from './get.flow/get.controller';
import { CreateEnterpriseMemberController } from './createEnterpriseMember.flow/create.controller';
import { RemoveEntepriseMemberService } from '@app/services/members/enterprise/removeMember.service';
import { GetEnterpriseMemberByIdService } from '@app/services/members/enterprise/getById.service';
import { GetEnterpriseMemberGroupByCondominiumIdService } from '@app/services/members/enterprise/getByGroupByCondominiumId.service';
import { CreateEnterpriseUserService } from '@app/services/members/enterprise/create.service';
import { Module } from '@nestjs/common';

@Module({
	controllers: [
		UpdateEnterpriseMemberController,
		RemoveEntepriseMemberController,
		GetEnterpriseMemberController,
		CreateEnterpriseMemberController,
	],
	providers: [
		UpdateEnterpriseMemberService,
		RemoveEntepriseMemberService,
		GetEnterpriseMemberByIdService,
		GetEnterpriseMemberGroupByCondominiumIdService,
		CreateEnterpriseUserService,
	],
})
export class EnterpriseMemberModule {}
