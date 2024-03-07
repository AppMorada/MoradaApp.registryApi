import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UserRepo } from '@app/repositories/user';
import { Name, PhoneNumber, UUID } from '@app/entities/VO';

interface IProps {
	id: string;
	phoneNumber?: string;
	name?: string;
}

@Injectable()
export class UpdateUserService implements IService {
	constructor(private readonly userRepo: UserRepo) {}

	async exec(input: IProps) {
		if (!input.name && !input.phoneNumber) return;

		await this.userRepo.update({
			id: new UUID(input.id),
			name: input.name ? new Name(input.name) : undefined,
			phoneNumber: input.phoneNumber
				? new PhoneNumber(input.phoneNumber)
				: undefined,
		});
	}
}
