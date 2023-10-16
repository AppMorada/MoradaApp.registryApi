import { User } from '@app/entities/user';
import { UserRepo } from '@app/repositories/user';
import { Injectable } from '@nestjs/common';

interface IProps {
	user: User;
}

@Injectable()
export class CreateUserService {
	constructor(private readonly userRepo: UserRepo) {}

	async exec(input: IProps) {
		await this.userRepo.create({ user: input.user });
	}
}
