import { Module } from '@nestjs/common';
import { CreateUserController } from './create.flow/create.controller';
import { CreateUserService } from '@app/services/createUser.service';
import { CreateTokenService } from '@app/services/createToken.service';
import { GenInviteService } from '@app/services/genInvite.service';
import { DeleteUserController } from './delete.flow/delete.controller';
import { DeleteUserService } from '@app/services/deleteUser.service';
import { GetCondominiumRelUserService } from '@app/services/getCondominiumRel.service';
import { GetUserController } from './get.flow/get.controller';
import { LoginUserController } from './login.flow/login.controller';
import { GenOldTFASevice } from '@app/services/genTFACode.old.service';
import { GenTFAService } from '@app/services/genTFA.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	controllers: [
		CreateUserController,
		DeleteUserController,
		GetUserController,
		LoginUserController,
		LoginUserController,
	],
	providers: [
		JwtService,
		CreateUserService,
		CreateTokenService,
		GenInviteService,
		DeleteUserService,
		GetCondominiumRelUserService,
		GenOldTFASevice,
		GenTFAService,
	],
})
export class UserModule {}
