import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import {
	ICreateUserInput,
	IDeleteUserParameters,
	IUserSearchQuery,
	UserRepo,
} from '@app/repositories/user';
import { UserPrismaMapper } from '../mapper/user';
import { User } from '@app/entities/user';

@Injectable()
export class UserPrismaRepo implements UserRepo {
	constructor(private readonly prisma: PrismaService) {}

	async create(input: ICreateUserInput): Promise<void> {
		const userInPrisma = UserPrismaMapper.toPrisma(input.user);

		await this.prisma.user.create({
			data: { ...userInPrisma },
		});
	}

	async find(input: IUserSearchQuery): Promise<User | undefined> {
		const user = await this.prisma.user.findFirst({
			where: {
				OR: [
					{ email: input.email?.value },
					{ CPF: input.CPF?.value },
					{ id: input?.id },
				],
			},
		});

		return user ? UserPrismaMapper.toClass(user) : undefined;
	}

	async delete(input: IDeleteUserParameters): Promise<undefined> {
		if (input.email)
			await this.prisma.user.delete({
				where: {
					email: input?.email?.value,
				},
			});
		else
			await this.prisma.user.delete({
				where: {
					id: input.id,
				},
			});
	}
}
