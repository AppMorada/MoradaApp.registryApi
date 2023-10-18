import { CryptAdapter } from '@app/adapters/crypt';
import { Password } from '@app/entities/VO/password';
import { User } from '@app/entities/user';
import { UserRepo } from '@app/repositories/user';
import { Injectable } from '@nestjs/common';
import { Dereference } from '@utils/dereference';

interface IProps {
	user: User;
}

@Injectable()
export class CreateUserService {
	constructor(
		private readonly userRepo: UserRepo,
		private readonly crypt: CryptAdapter,
	) {}

	async exec(input: IProps) {
		const hashPass = await this.crypt.hash(input.user.password.value);

		const user = Dereference.user(input.user);
		user.password = new Password(hashPass);

		await this.userRepo.create({ user });
	}
}
