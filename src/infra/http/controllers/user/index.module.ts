import { Module } from '@nestjs/common';
import { CreateUserController } from './create.flow/create.controller';
import { CreateUserService } from '@app/services/user/create.service';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { SendInviteService } from '@app/services/invites/sendInvite.service';
import { DeleteUserController } from './delete.flow/delete.controller';
import { DeleteUserService } from '@app/services/user/delete.service';
import { GetUserController } from './get.flow/get.controller';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserController } from './update.flow/update.controller';
import { UpdateUserService } from '@app/services/user/update.service';
import { GetEmployeeMemberByUserIdService } from '@app/services/members/employee/getByUserId.service';
import { GetCommunityMemberByUserIdService } from '@app/services/members/community/getByUserId.service';

@Module({
	controllers: [
		CreateUserController,
		DeleteUserController,
		GetUserController,
		UpdateUserController,
	],
	providers: [
		JwtService,
		CreateUserService,
		CreateTokenService,
		SendInviteService,
		DeleteUserService,
		GetEmployeeMemberByUserIdService,
		GetCommunityMemberByUserIdService,
		UpdateUserService,
		GenTFAService,
	],
})
export class UserModule {}
