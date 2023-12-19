import { Email } from '@registry:app/entities/VO/email';
import { UserRepo } from '@registry:app/repositories/user';
import { Injectable } from '@nestjs/common';

interface IProps {
	parameter: Email | string;
}

@Injectable()
export class DeleteUserService {
	constructor(private readonly userRepo: UserRepo) {}

	async exec(input: IProps) {
		input.parameter instanceof Email
			? await this.userRepo.delete({ email: input.parameter })
			: await this.userRepo.delete({ id: input.parameter });
	}
}
