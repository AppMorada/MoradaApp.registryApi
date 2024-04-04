import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../consts';
import { Request } from 'express';
import { User } from '@app/entities/user';
import { MakeCondominiumRequestService } from '@app/services/condominiumRequests/makeRequest';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { DeleteCondominiumRequestService } from '@app/services/condominiumRequests/deleteRequest';
import { ShowAllCondominiumRequestsService } from '@app/services/condominiumRequests/showAllRequests';
import { ShowAllUserCondominiumRequestsService } from '@app/services/condominiumRequests/showAlllUserRequests';
import { AcceptCondominiumRequestService } from '@app/services/condominiumRequests/acceptRequest';
import { Condominium } from '@app/entities/condominium';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { RequestMembershipDTO } from '@infra/http/DTO/condominium/requestMembership.DTO';
import { Throttle } from '@nestjs/throttler';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

@Controller(CONDOMINIUM_PREFIX)
export class LinkUsersController {
	constructor(
		private readonly acceptRequestService: AcceptCondominiumRequestService,
		private readonly requestAccessService: MakeCondominiumRequestService,
		private readonly denyRequestService: DeleteCondominiumRequestService,
		private readonly getAllRequestsService: ShowAllCondominiumRequestsService,
		private readonly getMyRequestsService: ShowAllUserCondominiumRequestsService,
	) {}

	@Post('requests/:condominiumId/accept/:userId')
	@UseGuards(AdminJwt)
	async acceptUserRequest(
		@Param('userId') userId: string,
		@Req() req: Request,
	) {
		const condominium = req.inMemoryData.condominium as Condominium;

		await this.acceptRequestService.exec({
			userId,
			condominiumId: condominium.id.value,
		});
	}

	@Throttle({
		default: {
			limit: 5,
			ttl: 60000,
		},
	})
	@Post('requests/call/:humanReadableId')
	@UseGuards(JwtGuard)
	async requestMembership(
		@Param('humanReadableId') hrId: string,
		@Req() req: Request,
		@Body() body: RequestMembershipDTO,
	) {
		const user = req.inMemoryData.user as User;
		const uniqueRegistry = req.inMemoryData
			.uniqueRegistry as UniqueRegistry;

		await this.requestAccessService.exec({
			condominiumHumanReadableId: hrId,
			userId: user.id.value,
			uniqueRegistryId: uniqueRegistry.id.value,
			message: body.message,
		});
	}

	@Get('my/requests')
	@UseGuards(JwtGuard)
	async getMy(@Req() req: Request) {
		const user = req.inMemoryData.user as User;
		const { requestCollection } = await this.getMyRequestsService.exec({
			userId: user.id.value,
		});

		return { requestCollection };
	}

	@Get('requests/:condominiumId')
	@UseGuards(AdminJwt)
	async getAll(@Param('condominiumId') condominiumId: string) {
		const requests = await this.getAllRequestsService.exec({
			condominiumId,
		});
		return { requestCollection: requests };
	}

	@HttpCode(204)
	@Delete('requests/:condominiumId/:userId')
	@UseGuards(AdminJwt)
	async deleteRequest(
		@Param('condominiumId') condominiumId: string,
		@Param('userId') userId: string,
	) {
		await this.denyRequestService.exec({
			userId,
			condominiumId,
		});
	}
}
