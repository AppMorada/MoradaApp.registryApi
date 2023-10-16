import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { ICreateUserInput, UserRepo } from '@app/repositories/user';
import { UserPrismaMapper } from '../mapper/user';

@Injectable()
export class UserPrismaRepo implements UserRepo {
	constructor(private readonly prisma: PrismaService) {}

	async create(input: ICreateUserInput): Promise<void> {
		const userInPrisma = UserPrismaMapper.toPrisma(input.user);

		await this.prisma.user.create({
			data: { ...userInPrisma },
		});
	}
}
