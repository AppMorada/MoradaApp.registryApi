import {
	Body,
	Controller,
	Delete,
	HttpCode,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Email } from '@registry:app/entities/VO';
import { SuperAdminJwt } from '@registry:app/auth/guards/super-admin-jwt.guard';
import { Request } from 'express';
import { DeleteUserDTO } from '@registry:infra/http/DTO/deleteAdminUser.DTO';
import { DeleteUserService } from '@registry:app/services/deleteUser.service';
import { User } from '@registry:app/entities/user';
import { CONDOMINIUM_PREFIX } from '../consts';

@Controller(CONDOMINIUM_PREFIX)
export class DeleteCondominiumController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(private readonly deleteUserService: DeleteUserService) {}

	@Delete('dev/:condominiumId/delete-user')
	@UseGuards(SuperAdminJwt)
	@HttpCode(204)
	async deleteUser(@Req() req: Request, @Body() body: DeleteUserDTO) {
		const user = req.inMemoryData.user as User;

		const email = new Email(body.email);
		await this.deleteUserService.exec({
			target: email,
			actualUser: user.email,
		});
	}
}
