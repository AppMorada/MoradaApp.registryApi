import { Module } from '@nestjs/common';
import { CreateCondominiumController } from './create.flow/create.controller';
import { DeleteCondominiumController } from './delete.flow/delete.controller';
import { JwtService } from '@nestjs/jwt';
import { CreateCondominiumService } from '@app/services/condominium/create.service';
import { GenInviteService } from '@app/services/invites/genInvite.service';
import { GetCondominiumController } from './get.flow/get.controller';
import { DeleteCondominiumService } from '@app/services/condominium/delete.service';
import { GetCondominiumService } from '@app/services/condominium/get.service';
import { UpdateCondominiumService } from '@app/services/condominium/update.service';
import { UpdateCondominiumController } from './update.flow/update.controller';
import { ReloadInviteService } from '@app/services/invites/reloadInvite.service';
import { GetCondominiumByOwnerIdService } from '@app/services/condominium/getByOwnerId.service';

@Module({
	controllers: [
		CreateCondominiumController,
		DeleteCondominiumController,
		GetCondominiumController,
		UpdateCondominiumController,
	],
	providers: [
		GenInviteService,
		ReloadInviteService,
		CreateCondominiumService,
		DeleteCondominiumService,
		GetCondominiumService,
		UpdateCondominiumService,
		GetCondominiumByOwnerIdService,
		JwtService,
	],
})
export class CondominiumModule {}
