import { Module } from '@nestjs/common';
import { CreateCondominiumController } from './create.flow/create.controller';
import { DeleteCondominiumController } from './delete.flow/delete.controller';
import { JwtService } from '@nestjs/jwt';
import { CreateCondominiumService } from '@app/services/condominium/create.service';
import { GetCondominiumController } from './get.flow/get.controller';
import { DeleteCondominiumService } from '@app/services/condominium/delete.service';
import { GetCondominiumService } from '@app/services/condominium/get.service';
import { UpdateCondominiumService } from '@app/services/condominium/update.service';
import { UpdateCondominiumController } from './update.flow/update.controller';
import { GetCondominiumByOwnerIdService } from '@app/services/condominium/getByOwnerId.service';
import { LinkUsersController } from './link.flow/linkUsers.controller';
import { MakeCondominiumRequestService } from '@app/services/condominiumRequests/makeRequest';
import { AcceptCondominiumRequestService } from '@app/services/condominiumRequests/acceptRequest';
import { DeleteCondominiumRequestService } from '@app/services/condominiumRequests/deleteRequest';
import { ShowAllCondominiumRequestsService } from '@app/services/condominiumRequests/showAllRequests';
import { ShowAllUserCondominiumRequestsService } from '@app/services/condominiumRequests/showAlllUserRequests';
import { SendInviteService } from '@app/services/invites/sendInvite.service';
import { GenTFAService } from '@app/services/login/genTFA.service';

@Module({
	controllers: [
		CreateCondominiumController,
		DeleteCondominiumController,
		GetCondominiumController,
		UpdateCondominiumController,
		LinkUsersController,
	],
	providers: [
		SendInviteService,
		GenTFAService,
		CreateCondominiumService,
		AcceptCondominiumRequestService,
		DeleteCondominiumRequestService,
		ShowAllCondominiumRequestsService,
		ShowAllUserCondominiumRequestsService,
		MakeCondominiumRequestService,
		DeleteCondominiumService,
		GetCondominiumService,
		UpdateCondominiumService,
		GetCondominiumByOwnerIdService,
		JwtService,
	],
})
export class CondominiumModule {}
