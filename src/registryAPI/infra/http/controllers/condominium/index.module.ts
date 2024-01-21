import { Module } from '@nestjs/common';
import { CreateCondominiumController } from './create.flow/create.controller';
import { InviteCondominiumController } from './invite.flow/invite.controller';
import { DeleteCondominiumController } from './delete.flow/delete.controller';
import { GenInviteService } from '@registry:app/services/genInvite.service';
import { DeleteUserService } from '@registry:app/services/deleteUser.service';
import { CreateCondominiumService } from '@registry:app/services/createCondominium.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	controllers: [
		CreateCondominiumController,
		InviteCondominiumController,
		DeleteCondominiumController,
	],
	providers: [
		GenInviteService,
		DeleteUserService,
		CreateCondominiumService,
		JwtService,
	],
})
export class CondominiumModule {}
