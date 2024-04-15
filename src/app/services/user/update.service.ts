import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UserRepoWriteOps } from '@app/repositories/user/write';
import { Name, Password, PhoneNumber, UUID } from '@app/entities/VO';
import { CryptAdapter } from '@app/adapters/crypt';

interface IProps {
	id: string;
	phoneNumber?: string;
	name?: string;
	password?: string;
}

@Injectable()
export class UpdateUserService implements IService {
	constructor(
		private readonly userRepo: UserRepoWriteOps,
		private readonly crypt: CryptAdapter,
	) {}

	async exec(input: IProps) {
		const password = input.password
			? new Password(await this.crypt.hash(input.password))
			: undefined;
		const name = input.name ? new Name(input.name) : undefined;
		const phoneNumber = input.phoneNumber
			? new PhoneNumber(input.phoneNumber)
			: undefined;

		const returnableContent = {
			requestedModifications: {
				name,
				phoneNumber,
				password,
			},
		};

		if (!name && !phoneNumber && !password) return returnableContent;

		await this.userRepo.update({
			id: new UUID(input.id),
			name,
			phoneNumber,
			password,
		});

		return returnableContent;
	}
}
