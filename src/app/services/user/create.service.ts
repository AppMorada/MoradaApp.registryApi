import { CryptAdapter } from '@app/adapters/crypt';
import { Password } from '@app/entities/VO';
import { User } from '@app/entities/user';
import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UserRepoWriteOps } from '@app/repositories/user/write';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

interface IProps {
	user: User;
	uniqueRegistry: UniqueRegistry;
}

@Injectable()
export class CreateUserService implements IService {
	constructor(
		private readonly userRepo: UserRepoWriteOps,
		private readonly crypt: CryptAdapter,
	) {}

	async exec({ user, uniqueRegistry }: IProps) {
		const hashPass = await this.crypt.hash(user.password.value);

		const userCopy = user.dereference();
		userCopy.password = new Password(hashPass);

		const result = await this.userRepo.create({
			user: userCopy,
			uniqueRegistry,
		});
		return result;
	}
}
