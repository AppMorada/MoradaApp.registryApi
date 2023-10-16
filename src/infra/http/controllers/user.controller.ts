import { CreateUserService } from '@app/services/createUser.service';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from '../DTO/createUser.DTO';
import { UserMapper } from '@app/mapper/user';
import { CondominiumJwt } from '@app/auth/guards/condominium-jwt.guard';
import { ICondominiumJwt } from '@app/auth/tokenTypes';
import { Request } from 'express';

@Controller('/user')
export class UserController {
	constructor(private readonly createUser: CreateUserService) {}

	@UseGuards(CondominiumJwt)
	@Post('admin')
	async create(@Req() req: Request, @Body() body: CreateUserDTO) {
		const data = req.inMemoryData as ICondominiumJwt;
		const user = UserMapper.toClass({
			...body,
			level: 3,
			condominiumId: data.sub,
		});
		await this.createUser.exec({ user });
	}
}
