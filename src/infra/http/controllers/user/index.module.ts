import { Module } from '@nestjs/common';
import { CreateUserController } from './create.flow/create.controller';
import { CreateUserService } from '@app/services/user/create.service';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { GenInviteService } from '@app/services/invites/genInvite.service';
import { DeleteUserController } from './delete.flow/delete.controller';
import { DeleteUserService } from '@app/services/user/delete.service';
import { GetUserController } from './get.flow/get.controller';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserController } from './update.flow/update.controller';
import { UpdateUserService } from '@app/services/user/update.service';
import { GetEnterpriseMemberByUserIdService } from '@app/services/members/enterprise/getByUserId.service';
import { GetCondominiumMemberByUserIdService } from '@app/services/members/condominium/getByUserId.service';

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
		GenInviteService,
		DeleteUserService,
		GetCondominiumMemberByUserIdService,
		GetEnterpriseMemberByUserIdService,
		UpdateUserService,
		GenTFAService,
	],
})
export class UserModule {}
