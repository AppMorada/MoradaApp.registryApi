import { Controller, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import { UserMapper } from '@app/mapper/user';
import { Request } from 'express';
import { User } from '@app/entities/user';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { USER_PREFIX } from '../consts';
import { GetEmployeeMemberByUserIdService } from '@app/services/members/employee/getByUserId.service';
import { GetCommunityMemberByUserIdService } from '@app/services/members/community/getByUserId.service';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';

@Controller(USER_PREFIX)
export class GetUserController {
	constructor(
		private readonly getCommunityRelation: GetCommunityMemberByUserIdService,
		private readonly getEmployeeRelation: GetEmployeeMemberByUserIdService,
	) {}

	@UseGuards(JwtGuard)
	@Get('me/community-member-section')
	@HttpCode(200)
	async getCondominiumMemberSection(@Req() req: Request) {
		const user = req.inMemoryData.user as User;
		const uniqueRegistry = req.inMemoryData
			.uniqueRegistry as UniqueRegistry;

		const relations = await this.getCommunityRelation.exec({
			id: user.id.value,
		});

		const uniqueRegistryAsObjt =
			UniqueRegistryMapper.toObject(uniqueRegistry);
		const userAsObjt = UserMapper.toObject(user) as any;
		delete userAsObjt.password;

		return {
			...userAsObjt,
			uniqueRegistry: uniqueRegistryAsObjt,
			memberInfos: relations.communityInfos,
		};
	}

	@UseGuards(JwtGuard)
	@Get('me/enterprise-user-section')
	@HttpCode(200)
	async getEnterpriseMemberSection(@Req() req: Request) {
		const user = req.inMemoryData.user as User;
		const uniqueRegistry = req.inMemoryData
			.uniqueRegistry as UniqueRegistry;

		const relations = await this.getEmployeeRelation.exec({
			id: user.id.value,
		});

		const uniqueRegistryAsObjt =
			UniqueRegistryMapper.toObject(uniqueRegistry);
		const userAsObjt = UserMapper.toObject(user) as any;
		delete userAsObjt.password;

		return {
			...userAsObjt,
			uniqueRegistry: uniqueRegistryAsObjt,
			employeeRelations: relations.content?.worksOn ?? [],
		};
	}
}
